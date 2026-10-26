- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete

## Project

Build a React + TypeScript web app named `sim-fuel-calculator` for calculating racing-sim fuel mileage and race fuel requirements.

Requirements:
- Calculate fuel per lap from laps completed and fuel consumed.
- Calculate required race fuel from race duration, average lap time, fuel per lap, and a configurable extra-lap buffer.
- Allow the safety reserve to be adjusted independently of the race calculation.
- Compare multiple named fuel-per-lap scenarios to show maximum usage and fuel savings.
- Calculate saved fuel weight at 0.75 kg/L, shown as kg for liters and lb for gallons.
- Support liters and gallons.
- Provide pit-stop and race plan summaries.
- Keep all calculations local in the browser.
- Use focused, responsive, practical interface patterns.

## Development

- Use npm for package management.
- Keep the implementation small and typed.
- Run `npm run build` after substantive changes.
- No VS Code extensions are required.
