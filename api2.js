var contenidofich = "";
var nombrefich = "";


function mostrarInfo(error,repo){
    var repodata = $("#repodata");
    if (error) {
	repodata.html("<p>Error code: " + error.error + "</p>");
    } else {
	repodata.html("<p>Repo data:</p>" +
	      "<ul><li>Nombre completo: " + repo.full_name + "</li>" +
	      "<li>Descripcion: " + repo.description + "</li>" +
	      "<li>Creado en: " + repo.created_at + "</li>" +
	      "</ul>")
    }
    repo.contents('master', '', showFiles);
    $("#formularioFichero").show();
};


function showFiles(error, contents) {
    if (error) {
        $("#contenidorepo").html("<p>Error code: " + error.error + "</p>");
    } else {
        var files = [];
        for (var i = 0, len = contents.length; i < len; i++) {
            files.push(contents[i].name);
        };
        $("#todoRepo").html("<p>Files:</p>" + "<ul id='files'><li>" + files.join("</li><li>") + "</li></ul>");
    };
}


function infoRepo() {

    var username = $("#user").val();
    var reponame = $("#repo").val();
    repo = github.getRepo(username, reponame);
    repo.show(mostrarInfo);
};

function escribirEnRepo(){

    nombrefich = $("#nombre").val();
    contenidofich = $("#contenido").val();

    repo.write('master', nombrefich, contenidofich, "commit realizado desde el propio ejercicio", function(err) {console.log (err)});
    $("#botonLeer").show();
}

function leerFichero(){

    console.log(nombrefich + contenidofich);
    repo.read("master", nombrefich, function(err, data) {
	    console.log (err, data);
	    $("#muestraLeido").html(data);
	});
	$("#muestraLeido").show();
}


$(document).ready(function() {

    hello.init({
	    github : "b1010b33e58412aba823"
    },{
	    redirect_uri : 'redirect.html',
	    oauth_proxy : "https://auth-server.herokuapp.com/proxy",
	    scope : "publish_files",
    });
    access = hello("github");
    access.login({response_type: 'code'}).then( function(){
	    auth = hello("github").getAuthResponse();
	    token = auth.access_token;
	    console.log (token);
	    github = new Github({
	        token: token,
	        auth: "oauth"
	    });
	    $("#muestraLeido").hide();
        $("#formularioFichero").hide();
        $("#botonLeer").hide();  
        $("#formularioInfo button").click(infoRepo);
        $("#formularioFichero button").click(escribirEnRepo);
        $("#botonLeer").click(leerFichero);
    }, function( e ){
	    alert('Signin error: ' + e.error.message);
    });
});
