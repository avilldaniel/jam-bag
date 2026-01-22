---
name: interview
description: Conduct a deep interview about the plan before writing code. Uses spec-first, interview-second, code-last methodology to gather thorough requirements.
---

# Interview Skill

This skill implements a "spec-first, interview-second, code-last" development approach. It conducts deep, thoughtful interviews about project requirements before writing specifications or code.

## How to Use

1. Read any existing plan file or context provided by the user
2. Use the AskUserQuestion tool to conduct a thorough interview
3. Generate a detailed specification when the interview is complete

## Interview Guidelines

### Question Depth

Ask non-obvious, in-depth questions. For complex features, ask 40+ questions across multiple rounds. Never settle for surface-level understanding.

### Topics to Explore

**Technical Implementation**
- Architecture and system design decisions
- Data models and storage requirements
- API design and integration points
- Performance considerations and constraints
- Security requirements and edge cases
- Error handling and failure modes

**UI/UX Requirements**
- User flows and interactions
- Visual design preferences
- Accessibility requirements
- Responsive behavior
- Loading states and feedback
- Empty states and error states

**Concerns and Tradeoffs**
- Known risks and mitigation strategies
- Technical debt considerations
- Scalability concerns
- Maintenance implications
- Dependencies and constraints

**Business Context**
- User personas and use cases
- Success metrics and KPIs
- Timeline and priority constraints
- Future roadmap considerations

### Interview Process

1. **Start broad**: Understand the overall goal and context
2. **Drill down**: Ask follow-up questions on each major area
3. **Challenge assumptions**: Ask "why" and explore alternatives
4. **Identify gaps**: Probe for edge cases and unconsidered scenarios
5. **Confirm understanding**: Summarize and verify before proceeding

### After the Interview

Once the interview is complete, generate a detailed specification that includes:

- Clear problem statement
- Functional requirements
- Non-functional requirements
- Technical approach
- UI/UX specifications
- Acceptance criteria
- Known limitations and future considerations

Write the specification to a file (e.g., `SPEC.md` or in the plan file) before any implementation begins.

## Philosophy

This approach emphasizes "slowing down to speed up." Investing time in proper requirements gathering prevents costly mistakes during implementation. The goal is to ensure both you and the user have crystal-clear understanding of what needs to be built before writing any code.
