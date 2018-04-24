(function($) {

    $( document ).ready(function() {
       $('.blog-item').matchHeight(); 
    
        var latestURL;
        var currentURL = $(location).attr("href");
    
        setInterval(function() {
    
            latestURL = $(location).attr("href");
    
            if(currentURL != latestURL) {
                $('.blog-item').matchHeight();
                currentURL = latestURL;
            } 
        }, 1000);
        
        
    });
    

})( jQuery );