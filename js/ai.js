const wrong=["top","miss"];

const categories={
    a:["c","c","c","c","c","c","c","c","c","w","c","c","c","c","c","c","c","c","c","c"],
    b:["c","c","c","c","c","w","c","c","c","c"],
    c:["c","c","c","w","c","c","c","c","c","w","c","c","c","c","c","c","w","c","c","c"],
    d:["c","c","w","c","c","w","c","c","w","c"],
    e:["c","w","c","w","c"],
    f:["c","w"],
    g:["c","w","c","w","w","w","c","c","c","w","c","w","w","c","w","c","w","c","w","w"],
    h:["w","c","w","w","c","w","c","w","w","c"],
    i:["w","w","c","w","w","w","c","w","c","w","c","w","w","c","w","c","w","c","w","w"],
    j:["w","c","w","c","w","w","c","w","w","w"],
    k:["w","w","c","w","w","w","c","w","w","w","c","w","w","w","w","c","w","c","w","w"],
    l:["w","c","w","w","w","w","c","w","w","w"],
}

function selectCategory(ratingDiff){
    let category;
    if(ratingDiff>8){
        category="a";
    }else if(ratingDiff>=7 && ratingDiff<=8){
        category="b";
    }else if(ratingDiff>=5 && ratingDiff<=6){
        category="c";
    }else if(ratingDiff>=3 && ratingDiff<=4){
        category="d";
    }else if(ratingDiff>=1 && ratingDiff<=2){
        category="e";
    }else if(ratingDiff==0){
        category="f";
    }else if(ratingDiff>=-2 && ratingDiff<=-1){
        category="g";
    }else if(ratingDiff>=-4 && ratingDiff<=-3){
        category="h";
    }else if(ratingDiff>=-6 && ratingDiff<=-5){
        category="i";
    }else if(ratingDiff>=-8 && ratingDiff<=-7){
        category="j";
    }else if(ratingDiff>=-10 && ratingDiff<=-9){
        category="k";
    }else if(ratingDiff<-10){
        category="l";
    }
    return category;
}

/*
max gk rating -- 89   
min gk rating -- 85            
min striker rating -- 81
max striker rating -- 95
rating difference range -10 to 8 
*/