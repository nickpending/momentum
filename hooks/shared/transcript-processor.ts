/**
 * Transcript Processor
 * Converts Claude Code JSONL transcripts into clean markdown for state generation
 */

interface TranscriptLine {
  type: string;
  message?: {
    role: string;
    content: any;
  };
}

interface ToolUse {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error: boolean;
}

export function processTranscript(jsonlContent: string): string {
  const lines = jsonlContent.trim().split('\n').filter(l => l.trim());
  const output: string[] = [];
  const toolUses = new Map<string, ToolUse>();

  for (const line of lines) {
    try {
      const event: TranscriptLine = JSON.parse(line);

      // Skip non-message events
      if (event.type !== 'user' && event.type !== 'assistant') {
        continue;
      }

      if (!event.message || !event.message.content) {
        continue;
      }

      const content = event.message.content;

      // Handle user messages
      if (event.type === 'user') {
        // Check if it's a tool result
        if (Array.isArray(content) && content[0]?.type === 'tool_result') {
          for (const item of content) {
            if (item.type === 'tool_result') {
              const toolResult = item as ToolResult;
              const toolUse = toolUses.get(toolResult.tool_use_id);

              if (toolUse) {
                output.push(`\n**Tool: ${toolUse.name}**`);

                // Show more detail for file operations
                if (toolUse.name === 'Edit' || toolUse.name === 'Write' || toolUse.name === 'Read') {
                  output.push(`File: ${toolUse.input.file_path}`);
                  if (toolUse.name === 'Edit') {
                    output.push(`Edit: ${truncateContent(toolUse.input.old_string, 100)} → ${truncateContent(toolUse.input.new_string, 100)}`);
                  }
                } else {
                  output.push(`Input: \`${JSON.stringify(toolUse.input)}\``);
                }

                if (toolResult.is_error) {
                  output.push(`Error: ${truncateContent(toolResult.content, 300)}`);
                } else {
                  const resultPreview = truncateContent(toolResult.content, 300);
                  if (resultPreview) {
                    output.push(`Result: ${resultPreview}`);
                  }
                }
              }
            }
          }
        } else {
          // Regular user message
          const text = typeof content === 'string' ? content : content[0]?.text || '';
          if (text && !text.startsWith('<command-message>')) {
            output.push(`\n**User:** ${text}`);
          }
        }
      }

      // Handle assistant messages
      if (event.type === 'assistant') {
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === 'text') {
              // Skip CLARVIS markers and system reminders
              const text = block.text || '';
              if (!text.includes('clarvis:') && !text.includes('<system-reminder>')) {
                output.push(`\n**Assistant:** ${text}`); // Keep full text
              }
            } else if (block.type === 'tool_use') {
              // Store tool use for matching with result later
              const toolUse = block as ToolUse;
              toolUses.set(toolUse.id, toolUse);
            } else if (block.type === 'thinking') {
              // Show brief thinking context
              const thinking = block.thinking || '';
              if (thinking) {
                output.push(`\n*Thinking:* ${truncateContent(thinking, 200)}`);
              }
            }
          }
        }
      }

    } catch (err) {
      // Skip malformed lines
      continue;
    }
  }

  return output.join('\n');
}

function truncateContent(content: any, maxLength: number): string {
  if (!content) return '';

  let text = typeof content === 'string' ? content : JSON.stringify(content);

  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}
