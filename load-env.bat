@ECHO OFF

ECHO -----------------------------------------------------------------------------------
ECHO Performing Module Loads
call module load msde/artifactory-eng-tools/prod
call module load ossjs/node/8.9.4

ECHO -----------------------------------------------------------------------------------
ECHO Setting up NPM
call setup_user -cli npm

ECHO -----------------------------------------------------------------------------------
ECHO Performing NPM install
call npm install --no-optional

ECHO -----------------------------------------------------------------------------------
ECHO installing UABC globally
npm i -g @socialgorithm/uabc

ECHO -----------------------------------------------------------------------------------
ECHO Installed npm and libs ready for battle
