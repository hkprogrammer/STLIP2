function laodDetails(){

    var data = JSON.parse(JSON.parse(localStorage.getItem("DetailResponse")));
    
    let passl = "";
    for(i=0;i<String(data["passlen"]);i++){
        passl += "*"
    }

    // let sub = "";
    // let ssub = data["subject"].split(",");

    // for(i=0;i<ssub.length;i++){
    //     sub += ssub[i];
    // }



    document.getElementById("username").innerHTML = data["name"];
    document.getElementById("password").innerHTML = passl;
    document.getElementById("grade").innerHTML = data["grade"];
    document.getElementById("subjects").innerHTML = data["subject"];
    document.getElementById("id").innerHTML = data["id"] 

    localStorage.removeItem("DetailResponse");


}