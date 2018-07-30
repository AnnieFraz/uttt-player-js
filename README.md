# Morganised uttt-player

Initial UTTT Player for the algorithm competition

## Getting started within MS

Once you have cloned this repo, you will need to run 

`load-env.bat`
Use load-env.ps1 for powershell

This will set the the MS NPM environment for you as well as install the UABC battle client. 

You will need to run this each time you open a new console window to work on this project.

## Running locally in practise mode

Within MS it is not possible to directly call globally installed NPM modules. As such you will notice there is a `uabc.bat` file.
This calls the global NPM module passing your arguments along.

To run a practise game you can run:

`uabc -p -f "node player.js"`
 

 
