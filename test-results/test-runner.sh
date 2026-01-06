#!/bin/bash
# Test Runner for Idea Analyzer
# This script runs tests for the analyzer using the Claude CLI

set -e

TEST_DIR="/Users/nathan/code/lab/goodcraft-app-idea-analyze/analyzer-v2/test-results"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo "=== Idea Analyzer Test Runner ==="
echo "Started at: $(date)"
echo "Output directory: $TEST_DIR"
echo ""

run_test() {
    local name="$1"
    local input_file="$2"
    local output_file="$3"

    echo "Running test: $name"
    echo "Input: $input_file"
    echo "Output: $output_file"

    if [ -f "$input_file" ]; then
        # Run the analysis through Claude CLI
        claude --print "$input_file" > "$output_file" 2>&1
        echo "Test completed: $name"
    else
        echo "ERROR: Input file not found: $input_file"
    fi
    echo ""
}

# Run tests here
echo "Tests will be run through direct prompting..."
