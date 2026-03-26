Write a daily check-in post for my blog.

## Arguments

The user will provide:
- **Date**: The date for the post (YYYY-MM-DD format)
- **Topic**: The algorithm/data structure/technique being studied
- **Problems**: LeetCode problem numbers and names that were solved (optional)
- **Article**: Some learning materials, blog/post/articles/web-page urls that needs to be summarized

## Post Location & Format

- Create the file at: `content/checkins/YYYY-MM-DD.md`
- Filename is the date with `.md` extension

## Front Matter

```yaml
---
title: "Topic Name – Short Catchy Subtitle"
tags: ["leetcode", "topic-tag", "category-tag"]
---
```

## Post Structure

The post should be **concise and summarized** — not a tutorial or textbook. It's a study log. Keep it tight.

### 1. Core Technique Section
- **What it is**: 1-2 sentences explaining the technique
- **When to use it**: 1-2 sentences on the problem patterns where this applies
- **Why use it**: 1-2 sentences on the complexity/efficiency benefit
- A short **template code block** in Python showing the reusable pattern

### 2. Problems Studied Section
For each LeetCode problem:
- `### {number}. {Problem Name}` as heading
- **1-3 sentences** explaining the key insight and how the technique applies. Not a full walkthrough — just the "aha" moment.
- A **short, correct Python solution** — clean and minimal

### 3. Key Patterns to Remember
- A markdown **table** summarizing patterns, when to use each, and which problems demonstrate them

### 4. (Optional) Comparison Table
- If the technique has a natural counterpart (e.g., prefix sum vs difference array), add a brief comparison table

## Style Rules

- Keep the whole post **under 120 lines** of markdown
- Prefer brevity over completeness — this is a personal study reference, not documentation
- Code solutions should be **correct and runnable** but don't need extensive comments
- Use `---` horizontal rules to separate major sections
- No emojis unless the problem name includes one (e.g., 🔒 for premium)
- No Chinese text in the post

## Workflow

1. Read 1-2 recent posts from `content/checkins/` to match the existing tone and style
2. Write the new post file
3. Commit and push to the current branch

$ARGUMENTS
