##Base Angular/Flat-UI Slush generator


###Prerequisites

Install `node.js`/`io.js` and required packages

[nodejs.org](http://nodejs.org)

    sudo npm install -g bower
    sudo npm install -g gulp
    sudo npm install -g slush
    sudo npm install -g babel
    sudo npm install -g less

###Installation

Install `slush-soda` globally

    sudo npm install -g cirqueit/slush-soda

###Generator

Run the slush generator, following the dialog.
The app is created in the specified directory, then runs `npm install`

    slush soda

###Development

####Setup server parameters

If necessary, modifiy the `port` and `live-reload port` variables inside `gulpfile.js`.


####Start serving app

`gulp`
