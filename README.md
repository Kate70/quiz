# quiz
## Overview
This is a web-based application for building questionnaires. 
## Base Level Features
### 1. **Questionnaire Catalog Page**
- Users can view a paginated list of available questionnaires.
- Each questionnaire card includes:
  - Name of the questionnaire
  - Description
  - Number of questions
  - Number of completions
  - Actions: edit, run, delete
  - The "edit" action leads to the questionnaire builder page

### 2. **Questionnaire Builder Page**
- Users can create a questionnaire by adding multiple questions.
- Possible question types:
  - **Text**: Free-form user input
  - **Single Choice**: User can select only one answer (radio buttons)
  - **Multiple Choice**: User can select multiple answers (checkboxes)
- Once the questionnaire is submitted, it is stored in the database.

### 3. **Interactive Questionnaire Page**
- Users can complete the questionnaire they previously created.
- After completing the questionnaire, users can view all their answers and the time it took to complete it.
- The responses are stored in the database and can be accessed later by clicking on the "Run" action.

  ## Technologies Used
- **Front-end**: HTML, CSS, JavaScript
- **Back-end**: Node.js, Express.js
- **Database**: MongoDB
