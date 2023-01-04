import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */
//const dataSource = new RESTDataSource("https://caha1906-lab1-backend-dt190g.azurewebsites.net/");
const dataSource = new RESTDataSource("http://localhost:3000");

/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying the list of Persons */
const PERSON_PAGE = "index.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";

/** An array of all persons to list on the page. */
let persons = [];

/** Limit the number of persons to show on the page. */
const limit = 100;


/**
 * Handles initialization of the app.
 */
function starterFunction() {
	// Get the name of the current page
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));
	
	// Get the list of persons from Atlas
	const personPromise = currentPage == PERSON_PAGE ? atlas.getPersons() : atlas.getPersons()	
	personPromise
	.then(async fetchedPersons => {
		persons = await fetchedPersons.json();
				
		createTable(); // create the table with the fetched courses
	})
	.catch(error => console.error(`An error occurd when getting persons from Atlas: ${error}`));
}

/**
* Creates the HTML table displaying the persons
*/
function createTable() {	

	// Descide the function to be used when creaing the HTML tabel
	const tableCreator = currentPage == PERSON_PAGE ? createTableForPersons : createTableForPersons//TODO: to get it right//createTableForMiunCourses;
	
    // Keep the original course array intact by assigning the filterad courses to a new array
    let personsToList = persons

    // Sorting the array by surname alpabetically
	personsToList = personsToList.sort((a, b) => a.surName.localeCompare(b.surName)).slice(0, limit); // limit the number of courses to display

	// Clear any existing data in the table
	const table = document.getElementById("persons_table");
	table.innerHTML = null;
	
	// Create the table 	
	tableCreator(personsToList, table);
}


/**
* Create table rows for all persons in the array.
* @param persons an array of persons to create table rows for
* @param table the table or the table body to add the rows to
*/
async function createTableForPersons(persons, table) {	

	// Disables the Update person button upon start
	disableButtonUpdatePerson();

	// For each person create a table row with data
	persons.forEach(person => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(person.firstName+" "+ person.surName, tr);		
        createTd(person.address, tr);        
        createTd(person.phone, tr);
		
		// Creates the button for update a person
		const _tdPhone = document.createElement('td');
		const btnUpdate = document.createElement('button');
		btnUpdate.innerText = 'Update';
		btnUpdate.socialSecurityNumber = person.socialSecurityNumber;

		// Adds listener		
		btnUpdate.addEventListener('click', () => getPersonToUpdate(person.socialSecurityNumber));		
		_tdPhone.appendChild(btnUpdate);
		tr.appendChild(_tdPhone);
					
		// Create a td
		const td = document.createElement("td");
		td.classList.add("center");		
		tr.appendChild(td);

		// Add delete-button to the row
		const _td = document.createElement('td');
		const btnDelete = document.createElement('button');
		btnDelete.innerText = 'Delete';
		btnDelete.socialSecurityNumber = person.socialSecurityNumber;
		// Add listener to the button
		btnDelete.addEventListener('click', () => deletePerson(person.socialSecurityNumber));
		_td.appendChild(btnDelete);
		tr.appendChild(_td);
		
		// Add the row to the table
		table.appendChild(tr);		
		
	});
	

	// Click events to submit, update -button and social security number visibility in the form
	if (currentPage.toLocaleLowerCase() == PERSON_PAGE.toLocaleLowerCase()) {
		
        document.querySelector('#newPersonSubmit').addEventListener('click', addNewPerson);
		document.querySelector('#updatePersonSubmit').addEventListener('click', updatePerson);
		document.querySelector('#toggle-visibility').addEventListener('click', toggleVisibility);

	};
	
}

/**
 * Adds a new person to persons-db
 */
async function addNewPerson() { 
		
    // Gets the data fron the html-form
	const form = document.querySelector('#newPerson');    
	const formBody = new FormData(form);

	//toggleVisibility();
	
	// Adds the person to db	
	const response = await atlas.addPerson(formBody.get('firstName'), formBody.get('surName'),formBody.get('address'),formBody.get('socialSecurityNumber'),formBody.get('phone')).then(res => res.json());

	// Show error to the user
	if (response.error) {		
		alert(response.error);
	} else {
		alert(response.firstName +" "+response.surName +" added!");
		// Refreshes the page
		location.reload();
		// Refreshes the form	
		form.reset();	
	}
			
}

/**
 * Gets the person to be updated from the table and displays info on page
 * @param {*} e the selected person
 * @returns a person
 */
async function getPersonToUpdate(e) {
	// Disables the button for submit a new person
	disableButtonAddPerson();
		
	// Enables the button for update a person
	enableButtonUpdatePerson();	
	
	// Gets the social security number
	const socialSecurityNumber = e;		

	// Get the person
	const getPersonPromise = atlas.getPerson(socialSecurityNumber)	
	
	const person = await getPersonPromise.then(async fetchPerson => {
		return await fetchPerson.json();

		//catch errors
	}).catch(error => 
		console.log(error)
	);	

	// Gets the input fields from html for displaying the data
	const firstNameInput = document.getElementById('first-name-input');
	const surNameInput = document.getElementById('sur-name-input');
	const addressInput = document.getElementById('address-input');
	const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	const phoneInput = document.getElementById('phone-input');

	// Disables the field for social security number
	socialSecurityNumberInput.disabled = true;
	
	// Masks the digits of social security number	
	socialSecurityNumberInput.type = "password";	

	// Set the values to the fields 
	firstNameInput.value = person.firstName;
	surNameInput.value = person.surName;
	addressInput.value = person.address;
	socialSecurityNumberInput.value = person.socialSecurityNumber;//maskedSocialSecurityumber;
	phoneInput.value = person.phone;
	
	// Displays the name of the person to be updated in h3 element
	const nameTag = document.getElementById('nameTag');
	nameTag.innerText = "Update " +firstNameInput.value + " "+ surNameInput.value;
	
	// Scrolls to element for update person
	nameTag.scrollIntoView();
	
	// Enables the button for update a person
	enableButtonUpdatePerson();	
}

/**
 * Updates a person from the information in the fields
 * @param {*} e the person to update
 */
async function updatePerson(e) {	

	// Prevents the default form submission behavior
	e.preventDefault();

	let test = e.socialSecurityNumber
	console.log(test);

	// Get the person data from input fields
	const firstNameInput = document.getElementById('first-name-input');
	const surNameInput = document.getElementById('sur-name-input');
	const addressInput = document.getElementById('address-input');
	const socialSecurityNumberInput = document.getElementById('social-security-number-input');
	const phoneInput = document.getElementById('phone-input');
		
	// Set values to be sent to person-db.json
	const firstName = firstNameInput.value;
	const surName = surNameInput.value;
	const address = addressInput.value;	
	e = socialSecurityNumberInput.value;
	const phone = phoneInput.value;
	
	// Sends the new values to the file
	const response = await atlas.updatePerson(e,firstName, surName, address,  phone).then(res => res.json());

	// Show error to the user
	if (response.error) {		
		alert(response.error);
	} else {
		alert(firstName +" "+surName +" updated!");		
		// Disables the button for update person
		disableButtonUpdatePerson();
		// Refreshes the page
		location.reload();
	}

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
 * Deletes a Person
 */
async function deletePerson(e) {
	
	// Deletes the person from the event e
	const deletedPerson = await atlas.deletePerson(e).then(res => res.json());
	
	// Returns the persons
	const result = persons.filter(person => person.socialSecurityNumber !== deletedPerson.socialSecurityNumber);
	
	// Alert for the user
	alert(deletedPerson.firstName + " " +deletedPerson.surName + " deleted!");

	// Refreshes the page
	location.reload();
	
	return result;	
};

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

/**
 * Toggles the visibility for social security number
 */
function toggleVisibility() {
	// Getting the element
	const socialSecurityNumber = document.getElementById("social-security-number-input");
	
	if (socialSecurityNumber.type === "password") {
		// Set the text to be visible(text)
		socialSecurityNumber.type = "text";
	} else {
		// Set the text to be hidden(password)
		socialSecurityNumber.type = "password";
	}
  }

document.addEventListener('DOMContentLoaded', starterFunction);
