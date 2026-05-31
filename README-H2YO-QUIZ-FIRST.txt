H2Yo quiz-first rebuild

This is the corrected rebuild, not the older brochure-style package.

Replace these files in the h2yo repo:
- index.html
- styles.css
- script.js

This version makes the funnel quiz/lead-capture first:
1. Hero sells the lead-capture promise.
2. Lead capture form is above the fold / first major action.
3. Visitor experiences the same opt-in path H2Yo sells.
4. Quiz/Yo Score comes immediately after opt-in.
5. Results emphasize scans, opt-ins, contacts, and follow-up.
6. Supporting examples/packages come after the conversion mechanism.

Required existing assets:
- assets/h2yo-logo.png
- assets/h2yo-fat-free.png
- assets/h2yo-sugar-free.png
- assets/h2yo-gluten-free.png
- assets/yo-concierge.png

Important:
The lead capture currently stores data in localStorage as a front-end placeholder.
Next build step is replacing that with an ARMS/GHL webhook or embedded GHL form/action.
