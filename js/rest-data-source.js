import { DataSource } from "./data-source.js";


/**
 * This class represents a data source where a REST API is used 
 * to get data from.
 * @extends DataSource
 */
export class RESTDataSource extends DataSource {
	/**
	 * Create a new data source with the specified JSON file as its source of data.
	 * @param url the name of the JSON file to be used as source of data
	 */
	constructor(url) {
		super(url);
	}

	/**
	 * Get data from the specified endpoint.
	 * @param endpoint default an empty string ''
	 * @param method default GET
	 * @param body default an empty body {}
	 * @return a Promise that resolves to the value of the given endpoint
	 */
	 async getData(endpoint = '', method = 'GET', body = {}) {
		return super.getData(endpoint, method, body);
		
	}

    /**
	* Get all persons from the REST API.
	* @return a Promise that resolves to an array of courses
	*/
	async getPersons() { //getCourses

		return this.getData('/api/persons');

	}

	/**
	* Get the person with specific social security number from the REST API.
	* @param socialSecurityNumber the course code of the course to get
	* @return a Promise that resolves to a course object or {} if the course doesn't exist
	*/
	async getPerson(socialSecurityNumber) { //getCourse		
		//console.log("From getPerson() in rest-data-source")
		//console.log(socialSecurityNumber)
		//console.log(this.getData('/api/persons/:' + socialSecurityNumber))
		return this.getData('/api/persons/:' + socialSecurityNumber);
		//return this.getData('/api/persons/:5');

	}

	/**
	* Get all My courses from the REST API.
	* @return a Promise that resolves to an array of My courses (a Miun course with grade included)
	*/
	async getMyCourses() { //TODO:remove?
		
		return this.getData('/api/courses/my');
		
	}

	/**
	* Get the My course with the specified course code from the REST API.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a My course object or {} if the course doesn't exist
	*/
	async getMyCourse(courseCode) { //TODO:remove?	 

		return this.getData('/api/courses/my/:'+courseCode);
		
	}

	/**
	* Add a My course with a grade to the REST API.
	* @param courseCode the course code for the course to be added
	* @param grade the student's grade in the course being added
	* @return a Promise that resolves to a My course object of the course added or an error 
	*         message explaining why the course couldn't be added
	*/
	async addPerson(firstName, surName, address, socialSecurityNumber, phone) { //addCourse
		
		return this.getData('/api/persons', 'POST', 
		//{'courseCode': courseCode, 'grade': grade});
        {'firstName': firstName, 'surName':surName, 'address':address, 'socialSecurityNumber':socialSecurityNumber, 'phone':phone});
	}	

	/**
	* Delete a person from the REST API.
	* @param socialSecurityNumber the course code for the course to be deleted
	* @return a Promise that resolves to the My course deleted or an error 
	*         message explaining why the course couldn't be deleted
	*/
	async deletePerson(socialSecurityNumber) { //deleteMyCourse
		
		return this.getData('/api/persons/' + socialSecurityNumber, 'DELETE');
		
	}

	/**
	* Update the grade for a My course in the REST API.
	* @param  socialSecurityNumber the id for the person to update the phone for
	* @param phone the new phone number
	* @return a Promise that resolves to the My course updated or an error 
	*         message explaining why the course's grade couldn't be updated
	*/
	updatePerson(socialSecurityNumber, phone) { //updateMyCourse
		
		return this.getData('/api/persons/' +socialSecurityNumber, 'PUT',
		{'socialSecurityNumber': socialSecurityNumber, 'phone': phone});

	}

	/**
	* Get all grades in the grade scale from the REST API.
	* @return a Promise that resolves to an array of grades
	*/
	async getGrades() { //TODO:remove?
		
		return this.getData('/api/grades');

	}
}
