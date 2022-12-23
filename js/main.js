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
* Creates the HTML table displaying the persons
*/
function createTable() {	

	// Descide the function to be used when creaing the HTML tabel
	const tableCreator = currentPage == MY_COURSES_PAGE ? createTableForPersons : createTableForPersons//TODO: to get it right//createTableForMiunCourses;

	// Regardles the type of table to create, sort and filter the courses
	//const searchString = document.getElementById("search").value.toLowerCase();

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
* Create table rows for all persons in the array.
* @param persons an array of persons to create table rows for
* @param table the table or the table body to add the rows to
*/
async function createTableForPersons(persons, table) {
	// Get grades from Atlas and then create the table //TODO:remove!
	//const grades = await atlas.getGrades().then(grades => grades.json()) //TODO:remove!
	//addPhoneListeners(); //TODO:remove!

	// Disables the Update person button upon start
	disableButtonUpdatePerson();

	// For each person create a table row with data
	persons.forEach(person => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(person.firstName+" "+ person.surName, tr);
		//createTd(person.surName, tr); //TODO:här!!!
        createTd(person.address, tr);
        //createTd(person.socialSecurityNumber, tr); //TODO: should not be displayed
        createTd(person.phone, tr);
		
		// Creates the button for update a person
		const _tdPhone = document.createElement('td');
		const btnUpdate = document.createElement('button');
		btnUpdate.innerText = 'Update';
		btnUpdate.socialSecurityNumber = person.socialSecurityNumber;

		// Adds listener
		//btnUpdate.addEventListener('click', () => updatePerson(person.socialSecurityNumber)); //TODO:working!
		btnUpdate.addEventListener('click', () => getPersonToUpdate(person.socialSecurityNumber));
		
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
		btnDelete.innerText = 'Delete';
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
        document.querySelector('#newPersonSubmit').addEventListener('click', addNewPerson);
		document.querySelector('#updatePersonSubmit').addEventListener('click', updatePerson);

	};
	
}

/**
 * Adds a new person to persons
 */
async function addNewPerson() { 
		
    // Gets the data fron the html-form
	const form = document.querySelector('#newPerson');
    console.log(form)//TODO:remove!
	const formBody = new FormData(form);
	
	// Adds the person to db
	//await atlas.addPerson(formBody.get('firstName'), formBody.get('surName'),formBody.get('address'),formBody.get('socialSecurityNumber'),formBody.get('phone')).then(res => res.json());
	const response = await atlas.addPerson(formBody.get('firstName'), formBody.get('surName'),formBody.get('address'),formBody.get('socialSecurityNumber'),formBody.get('phone')).then(res => res.json());

	// Show error to the user
	if (response.error) {		
		alert(response.error);
	} else {
		alert("Person added!");
		// Refreshes the page
		location.reload();
	}	

	// Refreshes the page	
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

async function ADGSGSGS(ssn) { //TODO:remove!!
	const response = await fetch(`http://localhost:3000/api/persons/${print}`);
	const data = await response.json();
	return data;
}

//Getperson function first
async function getPersonToUpdate(e) {
	// Disables the button for submit a new person
	disableButtonAddPerson();
	const print = e

	//const personTest = await atlas.getPerson(print);
	const personDFDFD = await ADGSGSGS(e); //TODO:remove!!

	console.log("personDF..    :"+personDFDFD.firstName)//TODO:remove!!
	//console.log("testhämta :" +personTest);
	console.log("testarprint: " + print) //TODO:remove!!
	// Enables the button for update a person
	enableButtonUpdatePerson();

	alert("Clicked!"); //TODO:remove!!
	// Gets the social security number
	const socialSecurityNumber = e;
	console.log(socialSecurityNumber); //TODO:remove!!
	let fetchPerson; //TODO:remove!!

	// Get the person
	const getPersonPromise = atlas.getPerson(socialSecurityNumber)	
	console.log("getPersonPromise :" +getPersonPromise); //TODO:remove!!
	const person = await getPersonPromise.then(async fetchPerson => {
		return await fetchPerson.json();
	});	
	
	console.log("person :" +person); //TODO:remove!!
	console.log("fetchPerson: " +fetchPerson) //TODO:remove!!
	//SAmma hit på båda varianterna av ":"+
	console.log("firstname :"+ person.firstname);

	// Gets the input fields from html for displaying the data
	const firstNameInput = document.getElementById('first-name-input');
	const surNameInput = document.getElementById('sur-name-input');
	const addressInput = document.getElementById('address-input');
	const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	const phoneInput = document.getElementById('phone-input');

	// Set the values to the fields 
	firstNameInput.value = person.firstName;
	surNameInput.value = person.surName;
	addressInput.value = person.address;
	socialSecurityNumberInput.value = ":"+person.socialSecurityNumber;
	phoneInput.value = person.phone;
	console.log("firstname :"+ person.firstname);

}

async function updatePerson(e) {
	
	// // Disables the button for submit a new person
	// disableButtonAddPerson();

	// // Enables the button for update a person
	// enableButtonUpdatePerson();

	// alert("Clicked!"); //TODO:remove!!
	// // Gets the social security number
	// const socialSecurityNumber = e;
	// console.log(socialSecurityNumber); //TODO:remove!!

	// // Get the person
	// const getPersonPromise = atlas.getPerson(socialSecurityNumber)	
	
	// const person = await getPersonPromise.then(async fetchPerson => {
	// 	return await fetchPerson.json();
	// });
	

	// // Gets the input fields from html for displaying the data
	// const firstNameInput = document.getElementById('first-name-input');
	// const surNameInput = document.getElementById('sur-name-input');
	// const addressInput = document.getElementById('address-input');
	// const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	// const phoneInput = document.getElementById('phone-input');

	// // Set the values to the fields 
	// firstNameInput.value = person.firstName;
	// surNameInput.value = person.surName;
	// addressInput.value = person.address;
	// socialSecurityNumberInput.value = "XXXXXXXXXX"//person?.socialSecurityNumber;
	// phoneInput.value = person.phone;

	///ABOVE OLD
	
	const socialSecurityNumber = e;

	// Get the person data
	const firstNameInput = document.getElementById('first-name-input');
	const surNameInput = document.getElementById('sur-name-input');
	const addressInput = document.getElementById('address-input');
	const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	const phoneInput = document.getElementById('phone-input');

	const firstName = firstNameInput.value;
	const surName = surNameInput.value;
	const address = addressInput.value;
	//const socialSecurityNumber = socialSecurityNumberInput.value;
	const phone = phoneInput.value;

	console.log("firstName       :"+firstName );

	//updatePerson(firstName, surName, address, socialSecurityNumber, phone)
	const response = await atlas.updatePerson(socialSecurityNumber,firstName, surName, address,  phone).then(res => res.json());

	// Show error to the user
	if (response.error) {		
		alert(response.error);
	} else {
		alert("Person added!");
	// Refreshes the page
		location.reload();
	}	

	// Refreshes the page	
	//form.reset();	
		
		

}

/**
 * Disables the button Update person
 */
function disableButtonUpdatePerson() {

	const updatePersonButton = document.getElementById('updatePersonSubmit');
	updatePersonButton.disabled = true;

};

/**
 * Enables the button Update person
 */
function enableButtonUpdatePerson() {

	const updatePersonButton = document.getElementById('updatePersonSubmit');
	updatePersonButton.disabled = false;

};

/**
 * Disables the button Add person
 */
function disableButtonAddPerson() {

	const addButton = document.getElementById('newPersonSubmit');
	addButton.disabled = true;

}

/**
 * Enables the button Add person
 */
function enableButtonAddPerson() {

	const addButton = document.getElementById('newPersonSubmit');
	addButton.disabled = false;

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
};

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
