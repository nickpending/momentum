#!/usr/bin/env python3
"""Generate a 6-character lowercase alphanumeric ID for feature tracking."""

import random
import string


def generate_id() -> str:
    """Generate a random 6-character lowercase alphanumeric ID."""
    chars = string.ascii_lowercase + string.digits
    return "".join(random.choice(chars) for _ in range(6))


if __name__ == "__main__":
    print(generate_id())
