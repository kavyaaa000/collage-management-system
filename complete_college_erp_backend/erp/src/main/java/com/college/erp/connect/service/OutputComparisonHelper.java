package com.college.erp.connect.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OutputComparisonHelper {

    /**
     * Compare outputs with proper normalization
     */
    public static boolean compareOutputs(String expected, String actual) {
        if (expected == null || actual == null) {
            return expected == actual;
        }

        // Strategy 1: Exact match after trimming trailing whitespace
        String normalizedExpected = normalizeOutput(expected);
        String normalizedActual = normalizeOutput(actual);

        if (normalizedExpected.equals(normalizedActual)) {
            return true;
        }

        // Strategy 2: Line-by-line comparison (ignoring trailing spaces per line)
        String[] expectedLines = expected.split("\\r?\\n");
        String[] actualLines = actual.split("\\r?\\n");

        if (expectedLines.length != actualLines.length) {
            log.debug("Line count mismatch: expected={}, actual={}",
                    expectedLines.length, actualLines.length);
            return false;
        }

        for (int i = 0; i < expectedLines.length; i++) {
            String expLine = expectedLines[i].stripTrailing();
            String actLine = actualLines[i].stripTrailing();
            if (!expLine.equals(actLine)) {
                log.debug("Line {} mismatch: expected='{}', actual='{}'",
                        i + 1, expLine, actLine);
                return false;
            }
        }

        return true;
    }

    /**
     * Normalize output:
     * - Trim trailing whitespace from entire output
     * - Convert all line endings to \n
     * - Remove final newline if present
     */
    private static String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }

        // Normalize line endings
        String normalized = output.replaceAll("\\r\\n", "\n");

        // Remove trailing whitespace
        normalized = normalized.stripTrailing();

        return normalized;
    }

    /**
     * Get debug comparison info
     */
    public static String getDebugInfo(String expected, String actual) {
        StringBuilder debug = new StringBuilder();

        debug.append("\n=== OUTPUT COMPARISON ===\n");
        debug.append(String.format("Expected length: %d\n", expected.length()));
        debug.append(String.format("Actual length:   %d\n", actual.length()));
        debug.append("\nExpected:\n'").append(expected).append("'\n");
        debug.append("\nActual:\n'").append(actual).append("'\n");

        // Show first difference
        int minLen = Math.min(expected.length(), actual.length());
        for (int i = 0; i < minLen; i++) {
            if (expected.charAt(i) != actual.charAt(i)) {
                debug.append(String.format("\nFirst difference at position %d:\n", i));
                debug.append(String.format("Expected char: '%c' (ASCII %d)\n",
                        expected.charAt(i), (int) expected.charAt(i)));
                debug.append(String.format("Actual char:   '%c' (ASCII %d)\n",
                        actual.charAt(i), (int) actual.charAt(i)));
                break;
            }
        }

        return debug.toString();
    }
}