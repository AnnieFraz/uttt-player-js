
ECHO -----------------------------------------------------------------------------------
ECHO "Performing Module Loads"
module load msde/artifactory-eng-tools/prod
module load ossjs/node/8.9.4

ECHO -----------------------------------------------------------------------------------
ECHO "Setting up NPM"
setup_user -cli npm

ECHO -----------------------------------------------------------------------------------
ECHO "Performing NPM install"
npm install --no-optional

ECHO -----------------------------------------------------------------------------------
ECHO "installing UABC globally"
npm i -g @socialgorithm/uabc

ECHO -----------------------------------------------------------------------------------
ECHO "Installed npm and libs ready for battle"
