import os
import sys

# Fix Windows terminal encoding
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")

# ── Quick test script ──────────────────────────────────────
# Usage: python main.py "Lahore ka mosam kaisa hai?"

from agent import ask_qwen_agent

def safe_print(text):
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode("ascii", errors="backslashreplace").decode("ascii"))


def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        safe_print("\n" + "=" * 60)
        safe_print("  Qwen Weather Agent")
        safe_print("=" * 60)
        safe_print(f"Query: {query}\n")
        reply = ask_qwen_agent(query)
        safe_print(reply)
    else:
        safe_print("=" * 60)
        safe_print("  Qwen Weather Agent - Terminal Chat Mode")
        safe_print("  (Type 'quit' to exit)")
        safe_print("=" * 60)
        while True:
            try:
                user = input("\nYou: ").strip()
                if not user:
                    continue
                if user.lower() in ["quit", "exit", "q"]:
                    safe_print("Goodbye!")
                    break
                safe_print("\nAgent thinking...\n")
                safe_print(ask_qwen_agent(user))
                safe_print("-" * 60)
            except KeyboardInterrupt:
                safe_print("\nGoodbye!")
                break

if __name__ == "__main__":
    main()
