# Design Principles - Composition First

A comprehensive guide for building composable tools and systems that follow Unix philosophy while leveraging modern development practices.

---

## 1. Composition Over Monoliths (Primary Principle)

- **Think Tools, Not Applications:**
    
    - Break complex problems into focused, single-purpose tools
    - Each tool should do one thing exceptionally well
    - Tools compose via clean data interfaces, not tight coupling
    - **Example:**
        
        ```bash
        # ❌ Monolithic approachmega-tool --parse --analyze --format --output# ✅ Composable approachparser input.txt | analyzer --mode=deep | formatter --json | outputter --file=result.json
        ```
        
- **Data Contracts as APIs:**
    
    - Tools communicate through standardized data formats
    - JSON, CSV, or structured text with clear schemas
    - Input validation at tool boundaries, not internal assumptions
    - **Example:**
        
        ```python
        # Each tool has clear input/output contractsdef parse_domains(input_stream) -> Iterator[DomainRecord]:    # Yields standardized DomainRecord objects    def analyze_domain(domain_record: DomainRecord) -> AnalysisResult:    # Accepts DomainRecord, returns AnalysisResult
        ```
        
- **Shared Infrastructure, Independent Logic:**
    
    - Common logging, configuration, and error handling libraries
    - Business logic remains independent and focused
    - No circular dependencies between tools

---

## 2. Progressive Tool Enhancement

- **Core Tools First:**
    
    - Build essential tools that handle 80% of use cases
    - Add specialized tools for edge cases and advanced features
    - Each tool can be used independently or in combination
- **Layered Capability:**
    
    - Simple tools for basic operations
    - Specialized tools for complex transformations
    - Meta-tools for orchestrating workflows
    - **Example:**
        
        ```bash
        # Basic tooldomain-parser file.txt# Enhanced tooldomain-analyzer --advanced --ml-model=bert# Workflow tooldomain-pipeline --config=config.yaml
        ```
        
- **Optional Complexity:**
    
    - Advanced features don't complicate basic usage
    - Tools have sensible defaults
    - Power users can access full capability when needed

---

## 3. Data-First Design

- **Standard Formats:**
    
    - JSON for structured data exchange
    - CSV for tabular data
    - Plain text for simple lists
    - Custom formats only when necessary
- **Schema Definition:**
    
    - Define clear data schemas for all tool interfaces
    - Validate inputs at tool boundaries
    - Document expected formats and transformations
    - **Example:**
        
        ```python
        @dataclassclass DomainRecord:    domain: str    source: str    timestamp: datetime    metadata: Dict[str, Any]        def __post_init__(self):        # Validation and normalization        self.domain = self.domain.lower().rstrip('.')
        ```
        
- **Transform Explicitly:**
    
    - Each tool's transformation should be clear and predictable
    - No hidden side effects or implicit data changes
    - Tools should be deterministic given the same input

---

## 4. Unix Philosophy Adaptation

- **Do One Thing Well:**
    
    - Each tool has a single, clear responsibility
    - Resist feature creep within individual tools
    - Extend capability by adding new tools, not features
- **Expect Tool Composition:**
    
    - Design tools to work as filters in pipelines
    - Support stdin/stdout for basic cases
    - Handle files for complex data structures
    - **Example:**
        
        ```bash
        # Tools work together naturallycat domains.txt | validate-domains | check-dns | analyze-security
        ```
        
- **Use Text Streams (When Appropriate):**
    
    - Simple data as text for easy debugging and inspection
    - Structured data as JSON for complex objects
    - Binary formats only when performance demands it

---

## 5. Modularity & Interfaces

- **Clean Separation:**
    
    - Tool logic separate from infrastructure concerns
    - Core functions independent of CLI wrapper
    - Easy to test individual components
- **Standard Interfaces:**
    
    - Consistent CLI patterns across tools
    - Common configuration approaches
    - Unified error handling and reporting
    - **Example:**
        
        ```bash
        # Consistent interface patternstool-name [input] --config=file --output=format --verbose
        ```
        
- **Dependency Injection:**
    
    - Tools receive dependencies (databases, APIs) as parameters
    - No hard-coded external dependencies
    - Easy to mock and test

---

## 6. Error Handling & Robustness

- **Fail Fast, Fail Clear:**
    
    - Validate inputs early and report specific errors
    - Use appropriate exit codes for different failure types
    - Provide helpful error messages with suggested fixes
- **Graceful Degradation:**
    
    - Tools handle partial data gracefully
    - Continue processing when possible, report skipped items
    - Support resume/retry for long-running operations
- **Observable Behavior:**
    
    - Consistent logging across all tools
    - Progress indicators for long operations
    - Debug modes for troubleshooting pipelines

---

## 7. Development & Testing

- **Tool-Level Testing:**
    
    - Each tool thoroughly tested in isolation
    - Integration tests for common tool combinations
    - Property-based testing for data transformations
- **Reproducible Builds:**
    
    - Isolated environments for each tool
    - Shared dependency management across tool ecosystem
    - Consistent packaging and distribution
- **Documentation as Code:**
    
    - Clear README for each tool with examples
    - Data format specifications
    - Pipeline cookbooks for common workflows

---

## 8. CLI Ergonomics for Composition

- **Scriptable by Default:**
    
    - Tools work well in shell scripts and automation
    - Minimal interactive prompts (use config files instead)
    - Predictable output formats
- **Human-Friendly Options:**
    
    - Verbose modes for debugging
    - Progress indicators for long operations
    - Helpful error messages with context
- **Configuration Management:**
    
    - Environment variables for common settings
    - Config files for complex tool setups
    - Command-line overrides for scripting

---

## 9. Evolution & Extension

- **Adding New Tools:**
    
    - New tools integrate with existing data formats
    - No breaking changes to established contracts
    - Clear migration paths when formats must evolve
- **Versioned Interfaces:**
    
    - Data format versions when schemas change
    - Backward compatibility for stable tools
    - Deprecation warnings before breaking changes
- **Ecosystem Growth:**
    
    - Tools can be developed independently
    - Clear guidelines for community contributions
    - Shared infrastructure supports new tools easily

---

## 10. Implementation Guidelines

- **Start Simple:**
    
    - Build core tools first, add specialization later
    - Prefer simple implementations over premature optimization
    - Focus on correct behavior before performance
- **Measure Integration:**
    
    - Test tool combinations regularly
    - Monitor pipeline performance end-to-end
    - Validate data integrity across tool boundaries
- **Shared Libraries:**
    
    - Common utilities for parsing, validation, output formatting
    - Shared configuration and logging infrastructure
    - Consistent error types and handling patterns

---

## Pre-Release Checklist for Tool Ecosystems

- [ ] Each tool has a single, clear responsibility
- [ ] Data contracts defined and documented
- [ ] Tools can be composed in multiple workflows
- [ ] Shared infrastructure provides consistent experience
- [ ] Error handling is predictable across tools
- [ ] Testing covers both individual tools and compositions
- [ ] Documentation includes usage examples and data formats
- [ ] Tools work well both independently and in pipelines
- [ ] Performance is acceptable for expected data volumes
- [ ] New tools can be added without breaking existing workflows