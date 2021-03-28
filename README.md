# Javascript Quiz website

## Architecture

The quiz website has three main sections:

1. The 'home' page
2. Running a quiz
3. Viewing the high scores


These sections are loaded in the initial HTML as three sections distinguished by their ID attribute. Depending on which 'page' is being shown, the visibility of the section is toggled by setting a style attribute of the section to "display:none;" or "display:block;". In this way; only a single index.html file is ever loaded.


### Quiz questions
Quiz questions are being loaded from a separate script, before the main scripts are being run.  The questions and answers  are shuffled each time the script is run.
There's a time penalty for incorrect questions. The questions are deliberately very difficult. For example:
(x => {x+2})("5") _might_ appear to asking for a recognition of using addition on strings, _however_, the anonymous function has no return statement and therefore the answer is undefined. 


### High Scores
High scores are kept in local storage and printed out to the High Scores section.