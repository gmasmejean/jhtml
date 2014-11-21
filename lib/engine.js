
var path = require('path'),
    fs = require('fs');

var engine = function(){
    
};

engine.prototype.force_create = true;
engine.prototype.template = require('./abstract_template');


engine.prototype.get = function( path, next ){
    
    
    
    
};

engine.prototype.createTemplate = function( path, next){
    
    
    
    
};

engine.prototype.parse = function( tpl_text ){
    
    var fnCode = '', matches= [],
        startRgx = new RegExp('((if|for)\\(((?!\\)\\s*:).)*\\)\\s*:)','g'),
        elseRgx = new RegExp('else\\s*:','g'),
        elseifRgx = new RegExp('(else\\s*if\\s*\\(((?!\\)\\s*:).)*\\)\\s*:)','g'),
        endRgx = new RegExp('endfor;|endif;','g');
            
    var src = jhtml.replace(new RegExp('\n|\t|\r','g'),'').replace(new RegExp('>\\s*<','g'),'><'),
        srcArray = src.split(new RegExp('(<\\?js|\\?>)','g')),
        isJs = false;    
    
    for( var i=0; i<srcArray.length; i++){
        if( srcArray[i] !== '<?js' && srcArray[i] !== '?>' && !isJs )
            fnCode += 'jhtml+=\''+srcArray[i].replace("'","\'")+'\';';
        if( isJs && srcArray[i] !== '<?js' && srcArray[i] !== '?>'){
            
            matches = srcArray[i].match(startRgx);
            if(matches)
                for( var j=0; j<matches.length; j++ )
                    srcArray[i] = srcArray[i].replace( matches[j], matches[j].slice(0,-1)+'{' );
            
            matches = srcArray[i].match(elseifRgx);
            if(matches)
                for( var j=0; j<matches.length; j++ )
                    srcArray[i] = srcArray[i].replace( matches[j], '}'+matches[j].slice(0,-1)+'{' );
            
            fnCode += srcArray[i].replace('echo','jhtml+=')
                                        .replace(endRgx,'}')
                                        .replace(elseRgx,'}else{');
        }
        if( srcArray[i] === '<?js' )
            isJs = true;
        else if( srcArray[i] === '?>')
            isJs = false;
    }
    return   'var jtpl = require(\'jhtml\').jtpl, jtpl_template = function(){jtpl.apply(this,arguments);};'
            +'jtpl_template.prototype= new jtpl();'
            +'jtpl_template.prototype.constructor= jtpl_template;'
            +'jtpl_template.render = function(datas){var jhtml=\'\', datas=datas||this.datas; '+fnCode+' return jhtml; };'
            +'module.exports = jtpl_template;';
    
};

module.exports = engine;