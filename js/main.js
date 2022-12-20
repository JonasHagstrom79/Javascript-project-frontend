import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */
//const dataSource = new RESTDataSource("https://caha1906-lab1-backend-dt190g.azurewebsites.net/");
const dataSource = new RESTDataSource("http://localhost:3000");

/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying the list of My courses */
const MY_COURSES_PAGE = "my-courses.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";

/** An array of all persons to list on the page. */
let persons = [];
let persons2 = []; //TODO:test!!!

/** A person from the json */
let person = {};
let getPerson;
let firstName;
let surName;
let socialSecurityNumber;
let address;
let phone;

let courses = []; //TODO:to get rid of referene-error

/** Limit the number of persons to show on the page. */
const limit = 100;


/**
 * Handles initialization of the app.
 */
function starterFunction() {
	// Get the name of the current page
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));

	
	
	// Get the list of courses from Atlas
	const personPromise = currentPage == MY_COURSES_PAGE ? atlas.getPersons() : atlas.getPersons()//: atlas.getCourses();
	console.log("PersonPromise"); //TODO:remove
    console.log(personPromise) //TODO:remove
    console.log("PersonPromise"); //TODO:remove
	personPromise
	.then(async fetchedPersons => {
		persons = await fetchedPersons.json();
		console.log(persons) //TODO:remove		
		createTable(); // create the table with the fetched courses
	})
	.catch(error => console.error(`An error occurd when getting persons from Atlas: ${error}`));
}

/**
* Creates the HTML table displaying the courses (either Miun courses or My courses).
*/
function createTable() {
	// The type of course (a Miun course or a My course) to be listed in the table depends
	// on the name of the current location (name of the page). The structure of the table 
	// displaying course data also depends upon this.

	// Descide the function to be used when creaing the HTML tabel
	const tableCreator = currentPage == MY_COURSES_PAGE ? createTableForPersons : createTableForPersons//TODO: to get it right//createTableForMiunCourses;

	// Regardles the type of table to create, sort and filter the courses
	const searchString = document.getElementById("search").value.toLowerCase();

	// Keep the original course array intact by assigning the filterad courses to a new array
	// let coursesToList = courses.filter(course => searchFilter(course, searchString));
	// coursesToList = coursesToList.sort(courseCodeDescending).slice(0, limit); // limit the number of courses to display

    // Keep the original course array intact by assigning the filterad courses to a new array
    let personsToList = persons
    // Sorting the array by surname alpabetically
	personsToList = personsToList.sort((a, b) => a.surName.localeCompare(b.surName)).slice(0, limit); // limit the number of courses to display

	// Clear any existing data in the table
	const table = document.getElementById("persons_table");
	table.innerHTML = null;
	
	// Create the table 
	// (a call to createTableForMyCourses(courses, table) or createTableForMiunCourses(courses, table))
	tableCreator(personsToList, table);
}

/**
* Create table rows for all Miun courses in the array. //TODO:remove method!
* @param courses an array of Miun courses to create table rows for
* @param table the table or the table body to add the rows to
*/
function createTableForMiunCourses(persons, table) {
	// For each course create a table row with course data
	persons.forEach(person => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(course.courseCode, tr); //TODO: ad person. here?
		createTd(course.name, tr);		
		createTd(course.subjectCode, tr)
		createTd(course.progression, tr);
		createTd(course.points, tr);
		createTd(course.institutionCode, tr,
			element => element.classList.add("center"));

		// Add the row to the table
		table.appendChild(tr);
	});
}

/**
* Create table rows for all My courses in the array.
* @param persons an array of persons to create table rows for
* @param table the table or the table body to add the rows to
*/
async function createTableForPersons(persons, table) {
	// Get grades from Atlas and then create the table
	//const grades = await atlas.getGrades().then(grades => grades.json())
	//addPhoneListeners(); //TODO:remove!

	// For each My course create a table row with course data
	persons.forEach(person => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(person.firstName+" "+ person.surName, tr);
		//createTd(person.surName, tr); //TODO:här!!!
        createTd(person.address, tr);
        //createTd(person.socialSecurityNumber, tr); //TODO: should not be displayed
        createTd(person.phone, tr);

		//Test button
		// Creates the button
		const _tdPhone = document.createElement('td');
		const btnUpdate = document.createElement('button');
		btnUpdate.innerText = 'Uppdatera';
		btnUpdate.socialSecurityNumber = person.socialSecurityNumber;

		// Adds listener
		btnUpdate.addEventListener('click', () => updatePerson(person.socialSecurityNumber)); //TODO:working!
				
		_tdPhone.appendChild(btnUpdate);
		tr.appendChild(_tdPhone);

		// Test button
			
		// Create a td to hold the select element for selecting grade
		const td = document.createElement("td");
		td.classList.add("center");

		// Create a select element for the grades that can be selected
		// const selectElement = document.createElement("select");
		// selectElement.id = "select_" + course.courseCode;
			
		// Add each grade as an option in the select element and set
		// the course grade as the selected grade in the list
		// createGradeOptions(selectElement, grades, course.grade);
		
		// Eventlistenser to select option //TODO: Here for change phone-number!!
		//selectElement.addEventListener('change', _event => updateMyCourse(course.courseCode));

		//td.appendChild(selectElement);
		tr.appendChild(td);

		// Add delete-button to the row
		const _td = document.createElement('td');
		const btnDelete = document.createElement('button');
		btnDelete.innerText = 'Radera';
		btnDelete.socialSecurityNumber = person.socialSecurityNumber;
		// Add listener to the button
		btnDelete.addEventListener('click', _event => deletePerson(person.socialSecurityNumber));
		_td.appendChild(btnDelete);
		tr.appendChild(_td);

		// Add the row to the table
		table.appendChild(tr);		
		
	});

	// Creates gradeoptions for (to be)added course	
	// const select = document.getElementById('newMyCourseSelect');	
	// createGradeOptions(select, grades, grades); 

	// Click event to submit button in the form
	if (currentPage.toLocaleLowerCase() == MY_COURSES_PAGE.toLocaleLowerCase()) {

		//document.querySelector('#newMyCourseSubmit').addEventListener('click', addNewMyCourse);
        document.querySelector('#newPersonSubmit').addEventListener('click', addNewMyCourse);

	};
	
}

/**
 * Adds a new person to persons
 */
async function addNewMyCourse() { //TODO:rename!
	//newPersonSubmit
	// // Gets the data fron the html-form
	// const form = document.querySelector('#newMyCourse');
	// const formBody = new FormData(form);
	
	// await atlas.addMyCourse(formBody.get('courseCode'), formBody.get('grade')).then(res => res.json());
	
	// // Refreshes the page
	// location.reload();
	// form.reset();
    // Gets the data fron the html-form
	const form = document.querySelector('#newPerson');
    console.log(form)//TODO:remove!
	const formBody = new FormData(form);
	
	await atlas.addPerson(formBody.get('firstName'), formBody.get('surName'),formBody.get('address'),formBody.get('socialSecurityNumber'),formBody.get('phone')).then(res => res.json());
	
	// Alert for the user
	alert("Person added!");

	// Refreshes the page
	location.reload();
	form.reset();		
}

/**
 *  Updates a course grade with selected grade
 */
async function updateMyCourse(e) {

	// Gets the coursecode 
	const code = e

	// Gets the grade
	const grade = document.getElementById(`select_`+code); //NYTT2022-11-29
	
	// Gets the value from select element select option
	const value = grade.value	

	// Upddates course grade
	const updateMyCourse = await atlas.updateMyCourse(e, value).then(res => res.json());
	const updateMyCourseIndex = courses.findIndex(obj => obj.courseCode == e); 
	
	courses[updateMyCourseIndex] = updateMyCourse;

}

async function updatePerson(e) {

	alert("Clicked!");
	const socialSecurityNumber = e;
	console.log(socialSecurityNumber);

	// Get the person
	const getPersonPromise = atlas.getPerson(socialSecurityNumber)
	
	getPersonPromise
	.then(async fetchPerson => {
		
		getPerson = await fetchPerson.json();
		console.log("getPerson below") //TODO:remove!
		console.log(getPerson)//TODO:remove!
		console.log("getPerson above") //TODO:remove!

	});

	const person = getPerson;
	console.log("persn below")
	console.log(person?.surName +" "+ person?.firstName)
	
	//const label = document.getElementById('test');
	//label.textContent = JSON.stringify(person?.firstName);

	const firstNameInput = document.getElementById('first-name-input');
	const surNameInput = document.getElementById('sur-name-input');
	const addressInput = document.getElementById('address-input');
	const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	const phoneInput = document.getElementById('phone-input');

	firstNameInput.value = person?.firstName;
	surNameInput.value = person?.surName;
	addressInput.value = person?.address;
	socialSecurityNumberInput.value = person?.socialSecurityNumber;
	phoneInput.value = person?.phone;

	// const form = document.querySelector('#newPerson');
    
	// const formBody = new FormData(form);
	
	// await atlas.getPerson(formBody.set('firstName', person?.firstName), formBody.set('surName', person?.surName),formBody.set('address', person?.address),formBody.set('socialSecurityNumber', person?.socialSecurityNumber),formBody.set('phone', person?.phone)).then(res => res.json());
	




	//TODO: getPerson kommer inte in!!
	// const response = atlas.getPerson(socialSecurityNumber);
	// console.log("response");
	// console.log(response);
	// console.log("response");
	// //const response = await fetch(`/api/person/${socialSecurityNumber}`);
	// response
	// .then(async fetchedPerson => {
	// 	person = await fetchedPerson.json();
	// 	console.log(person);
	// })	
	
	
	//const person = await response.json();

	//console.log(person);

	// var person;
	// var response;
	// var data;
	// var firstName;

	// const personG = await atlas.getPerson(socialSecurityNumber).then(personG = person.json());
	// const personG = await atlas.getPerson(socialSecurityNumber).then(response => response.json()).then(data => {})
	// 						//http://127.0.0.1:5501/api/persons/5
	// fetch('http://localhost:3000/api/persons/5') //http://localhost:3000/api/persons/5
  	// .then(response => response.json())
  	// .then(data => {
    // 	// data är nu en JavaScript-objekt som du kan använda i din frontend-app
	// 	person.firstName = response.firstName;
  	// });
	
	// console.log(data);
	// personPromise.then(async fetchedPerson => {
	// 	person = await fetchedPerson.json();
	// 	console.log(person);
	// })
	//const persons = await atlas.getPersons();
	//persons = await fetchedPersons.json();
	//console.log(person);
	//console.log(persons); "cors"

	// const personPromise = currentPage == MY_COURSES_PAGE ? atlas.getPersons() : atlas.getPersons()//: atlas.getCourses();
	// console.log("PersonPromise"); //TODO:remove
    // console.log(personPromise) //TODO:remove
    // console.log("PersonPromise"); //TODO:remove
	// personPromise
	// .then(async fetchedPersons => {
	// 	persons = await fetchedPersons.json();
	// 	console.log(persons) //TODO:remove		

}


/**
 * Deletes a Person
 */
async function deletePerson(e) {
	
	// Deletes the person from the event e
	const deletedPerson = await atlas.deletePerson(e).then(res => res.json());
	
	// Returns the persons
	const result = persons.filter(person => person.socialSecurityNumber !== deletedPerson.socialSecurityNumber);
	
	// Alert for the user
	alert("Person deleted!");

	// Refreshes the page
	location.reload();
	
	return result;	
}

/**
* Create option elements for the specified select element.
* @param selectElement the select element to create and add option elements for
* @param grades an array of grades to create option elements for
* @param selectedGrade the grade to be the selected option in the selectElement
*/
function createGradeOptions(selectElement, grades, selectedGrade) {
	grades = ["-","fx","f","e","d","c","b","a"];  //TODO:remove!		
	// For each grade 
	for(let grade of grades) {
		
		// Create an option element
		const option = document.createElement("option");
		console.log("grade: ") //TODO:remove!
		console.log(grade) //TODO:remove!
		
		// Add the text of the grade to the option
		option.innerText = grade.toUpperCase(); //TODO:blir fel här med uppercase
		
		// Add the option the selectElement
		selectElement.appendChild(option)
		
	}	
	console.log("grades: ")
	console.log(grades)
	// Set selectedGrade from myCourses
	selectElement.value = selectedGrade	
	
}

/**
* Create a data cell (td element) with the specified text
* @param text the text to to be displayed in the data cell
* @param tr the table row to add the data cell to
* @param extra a lambda that handles any extra that needs to be added to the data cell
*/
function createTd(text, tr, extra) {
	const td = document.createElement("td");
	td.innerText = text;
	
	if (extra) {
		extra(td);
	}

	tr.appendChild(td);
}

function addPhoneListeners() { //TODO:remove!
	// Få tag på tabellen
	var table = document.getElementById("persons_table");

	// Loopa igenom alla celler i tabellen
	for (var i = 0; i < table.rows.length; i++) {
  		for (var j = 0; j < table.rows[i].cells.length; j++) {
    		// Lägg till en lyssnare på varje cell
    		table.rows[i].cells[j].addEventListener("click", function() {
      			// Ta bort alla textrutor som finns i tabellen
      			removeInputs();

      			// Hämta cellen som klickades på
      			var cell = this;

      			// Skapa en textruta och lägg till den i cellen
      			var input = document.createElement("input");
      			input.type = "text";
      			input.value = cell.innerHTML;
      			cell.innerHTML = "";
      			cell.appendChild(input);
      			input.focus();

      			// Skapa en knapp och lägg till den i cellen
      			var button = document.createElement("button");
      			button.innerHTML = "Spara";
      			cell.appendChild(button);

      			// Lägg till en lyssnare på knappen
      			button.addEventListener("click", function() {
        		// Uppdatera värdet i tabellen med det nya värdet från textrutan
        		cell.innerHTML = input.value;
      		});
    	});
  	}
}

// En hjälpfunktion för att ta bort alla textrutor från tabellen
function removeInputs() {
  var inputs = document.getElementsByTagName("input");
  while (inputs.length > 0) {
    inputs[0].parentNode.innerHTML = inputs[0].value;
  }
}

}

/**
 * Perform a search for courses matching the text entered in the search input.
 */
function searchCourses() {
	// A re-creation of the table will filter out the courses not matching the searched value
	createTable();
}

document.addEventListener('DOMContentLoaded', starterFunction);
