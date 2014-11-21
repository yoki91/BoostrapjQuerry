var API_BASE_URL = "https://api.github.com";
var USERNAME = "";
var PASSWORD = "";
var NUMERODEPAGINA = 1;

/*$.ajaxSetup({
    headers: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD) }
});*/

/*
Details about repository of GitHub API 
https://developer.github.com/v3/repos/
*/

$("#button_autentificacion").click(function(e) {
	e.preventDefault();
	getAutentificacion( $("#name_autentificacion").val(), $("#contraseña_autentificacion").val());
});

$("#button_get_repos").click(function(e) {
	e.preventDefault();
	getRepos();
});

$("#button_get_reposlistado").click(function(e) {
	e.preventDefault();
	getReposlistado();
});

$("#button_get_reposnext").click(function(e) {
	e.preventDefault();
	getReposnext(NUMERODEPAGINA=NUMERODEPAGINA+1);
})
$("#button_get_reposprev").click(function(e) {
	e.preventDefault();
	getReposprev(NUMERODEPAGINA=NUMERODEPAGINA-1);
})

$("#button_delete_repo").click(function(e) {
	e.preventDefault();
	deleterepo($("#repository_name_delete").val());
});

$("#button_get_repo").click(function(e) {
	e.preventDefault();
	getRepo($("#repository_name").val());
});

$("#button_get_repo_to_edit").click(function(e) {
	e.preventDefault();
	getRepoToEdit($("#repository_name_get_to_edit").val());
});


$("#button_edit_repo").click(function(e) {
	e.preventDefault();

    var newRepo = new Object();
	newRepo.name = $("#repository_name_to_edit").val()
	newRepo.description = $("#description_to_edit").val()
	
	updateRepo(newRepo);
});

$("#button_to_create").click(function(e) {
	e.preventDefault();

    var newRepo = new Object();
	newRepo.name = $("#repository_name_to_create").val();
	newRepo.description = $("#description_to_create").val();
 	newRepo.homepage = "https://github.com";
 	newRepo.private = false;
	newRepo.has_issues = true;
	newRepo.has_wiki = true;
	newRepo.has_downloads = true;

	createRepo(newRepo);
});


function getAutentificacion(nombre,pass){

USERNAME =nombre;
PASSWORD = pass;

	if( nombre == "" || pass == "" ){
		$("#panel_aut").text('RELLENA LOS CAMPOS');
		document.getElementById('panel_aut').style.background='#FF5050';
	}
	else{
		$.ajaxSetup({
		headers: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD) }
		});
		document.getElementById("Columna1").style.display = "block";
		document.getElementById("Columna2").style.display = "block";
		document.getElementById("Columna3").style.display = "block";
		document.getElementById("Columna4").style.display = "block";
		document.getElementById("Columna5").style.display = "block";
		document.getElementById("autentificacion").style.display = "none";
	}
	
}

function deleterepo(repository_name){
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;
	
	$("#get_delete_result").text("");

	$.ajax({
		url : url,
		type : 'DELETE',
		crossDomain : true,
		dataType : 'json',
		statusCode: {
    		204: function() {$('<div class="alert alert-danger"> <strong>Oh!</strong> Page not found </div>').appendTo($("#get_delete_result"));}
    	}
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Updated</div>').appendTo($("#get_delete_result"));		
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#get_delete_result"));
	});
}
function getRepos() {
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos';
	$("#repos_result").text('');
	document.getElementById("button_get_reposprev").style.display = "none";
	document.getElementById("button_get_reposnext").style.display = "none";
	$("#numero_de_pagina").text("List Repositories");
	NUMERODEPAGINA = 1;
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var repos = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(jqxhr.getAllResponseHeaders('Link'))
				
				$.each(repos, function(i, v) {
					var repo = v;

					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
					document.getElementById("button_get_reposlistado").style.display = "block";
					
				});
	}).fail(function() {
	document.getElementById("Columna1").style.display = "none";
	document.getElementById("Columna2").style.display = "none";
	document.getElementById("Columna3").style.display = "none";
	document.getElementById("Columna4").style.display = "none";
	document.getElementById("Columna5").style.display = "none";
	document.getElementById("autentificacion").style.display = "block";
	$("#panel_aut").text('Usuario i/o Contraseña erroneos ');
	document.getElementById('panel_aut').style.background='#CC66FF';
	});

}

function getReposlistado() {
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos?page='+NUMERODEPAGINA +'&per_page=2';
	$("#repos_result").text('');
	$("#numero_de_pagina").text("Página: "+NUMERODEPAGINA);
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var repos = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(jqxhr.getAllResponseHeaders('Link'))
				
				$.each(repos, function(i, v) {
					var repo = v;
					
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
					document.getElementById("button_get_reposlistado").style.display = "none";
					document.getElementById("button_get_reposnext").style.display = "block";
					
				});
				//NUMERODEPAGINA++;
								
	}).fail(function() {
	document.getElementById("Columna1").style.display = "none";
	document.getElementById("Columna2").style.display = "none";
	document.getElementById("Columna3").style.display = "none";
	document.getElementById("Columna4").style.display = "none";
	document.getElementById("Columna5").style.display = "none";
	document.getElementById("autentificacion").style.display = "block";
	$("#panel_aut").text('Usuario i/o Contraseña erroneos ');
	document.getElementById('panel_aut').style.background='#CC66FF';
	});

}


function getReposnext(nexnumber){
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos?page='+nexnumber +'&per_page=2';
	$("#repos_result").text('');
	$("#numero_de_pagina").text("Página: "+nexnumber);
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var repos = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(jqxhr.getAllResponseHeaders('Link'))
				
				$.each(repos, function(i, v) {
					var repo = v;
					
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
					document.getElementById("button_get_reposnext").style.display = "block";
					document.getElementById("button_get_reposprev").style.display = "block";					
				});
				if (data== "")
				{
				$("#repos_result").text("No  more repositories.");
				document.getElementById("button_get_reposnext").style.display = "none";
				document.getElementById("button_get_reposprev").style.display = "block";
				//NUMERODEPAGINA--;
				
				}
				else
				{
				//NUMERODEPAGINA++;
				}
								
	}).fail(function() {
	$("#repos_result").text("No repositories.");
	});

}
function getReposprev(prenumber){
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos?page='+prenumber +'&per_page=2';
	$("#repos_result").text('');
	$("#numero_de_pagina").text("Página: "+prenumber);
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var repos = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(jqxhr.getAllResponseHeaders('Link'))
				
				$.each(repos, function(i, v) {
					var repo = v;
					
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
					document.getElementById("button_get_reposnext").style.display = "block";					
				});
				if (NUMERODEPAGINA== 1)
				{
				document.getElementById("button_get_reposprev").style.display = "none";
				document.getElementById("button_get_reposnext").style.display = "block";
				}
				else
				{
				//NUMERODEPAGINA--;
				}
								
	}).fail(function() {
	$("#repos_result").text("No repositories.");
	});

}

function getRepo(repository_name) {
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;
	$("#get_repo_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var repo = data;

				$("#get_repo_result").text('');
				$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#get_repo_result'));
				$('<p>').appendTo($('#get_repo_result'));	
				$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#get_repo_result'));
				$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#get_repo_result'));
				$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#get_repo_result'));
				$('</p>').appendTo($('#get_repo_result'));

			}).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Repository not found </div>').appendTo($("#get_repo_result"));
	});

}

function getRepoToEdit(repository_name_delete) {
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name_delete;
	$("#update_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
		
				var repo = data;
				

				$("#update_result").text('');
				$("#repository_name_to_edit").val(repo.name);
				$("#description_to_edit").val(repo.description);

	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Repository not found </div>').appendTo($("#update_result"));
	});

}

function updateRepo(repository) {
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository.name;
	var data = JSON.stringify(repository);

	$("#update_result").text('');

	$.ajax({
		url : url,
		type : 'PATCH',
		crossDomain : true,
		dataType : 'json',
		data : data,
		statusCode: {
    		404: function() {$('<div class="alert alert-danger"> <strong>Oh!</strong> Page not found </div>').appendTo($("#update_result"));}
    	}
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Updated</div>').appendTo($("#update_result"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#update_result"));
	});

}


function createRepo(repository) {
	var url = API_BASE_URL + '/user/repos';
	var data = JSON.stringify(repository);

	$("#create_result").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Created</div>').appendTo($("#create_result"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#create_result"));
	});

}

