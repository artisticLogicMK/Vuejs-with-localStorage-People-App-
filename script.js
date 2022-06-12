Vue.createApp({
  //1. First, set data properties
  data() {
    return {
      showAddPerson: false,
      
      //peopleList is where the people data stored in localStorage will be pushed to
      peopleList: [],
      //newPerson is person data gotten from binded inputs (v-model)
      newPerson: {
        name: '',
        occupation: ''
      },
      
      //trait data stored in localStorage will be pushed here
      traitList: [],
      newTrait: {
        trait: '',
        detail: ''
      }
    }
  },
  
  
  methods: {
    //2. Next, store new person in localStorage
    addPerson () {
      //set person data in object
      let personData = {
        name: this.newPerson.name,
        occupation: this.newPerson.occupation,
        
        //store current timestamp to be used as:
          //1. a unique primary-key to link people data to their individual traits data
          //2. for sorting peopleList chronologically
        timeId: Math.round((new Date()).getTime() / 1000)
      }
      
      //Then personData is pushed into peopleList
      if (this.peopleList.push(personData)) {
        //sort peopleList chronologically with 'timeId' property (new to old)
        this.peopleList = this.peopleList.sort((a, b) => b.timeId - a.timeId)
        
        //localStorage only allows string so peopleList is parsed to string before storing
        localStorage.setItem("peopleStorage", JSON.stringify(this.peopleList))
        
        //clear inputs and hide add container
        this.newPerson.name = ''
        this.newPerson.occupation = ''

        this.showAddPerson = false
      }
    },
    
    
    addPersonalityTrait (personTimeId) {
      const traitData = {
        trait: this.newTrait.trait,
        detail: this.newTrait.detail,
        //person time data parsed as an argument is used to attribute traits to persons
        person: personTimeId,
        //chronological sorting
        timeId: Math.round((new Date()).getTime() / 1000)
      }
      
      //traitData is pushed into 'traitList'
      if (this.traitList.push(traitData)) {
        //sort traitList chronologically (old to new)
        this.traitList = this.traitList.sort((a, b) => a.timeId - b.timeId)

        //convert to string and store
        localStorage.setItem("traitStorage", JSON.stringify(this.traitList))

        //clear inputs and hide add container
        this.newTrait.trait = ''
        this.newTrait.detail = ''
        
        document.getElementById('a_'+personTimeId).classList.toggle('hidden')
      }
    },
    
    
    deletePerson(personTimeId) {
      //filter current person based on their time data
      this.peopleList = this.peopleList.filter((p) => p.timeId !== personTimeId)
      localStorage.setItem("peopleStorage", JSON.stringify(this.peopleList))
      
      //remove person personality traits
      this.traitList = this.traitList.filter((trait) => trait.person !== personTimeId)
      localStorage.setItem("traitStorage", JSON.stringify(this.traitList))
    },
    
    deleteTrait(traitTimeId) {
      this.traitList = this.traitList.filter((trait) => trait.timeId !== traitTimeId)
      localStorage.setItem("traitStorage", JSON.stringify(this.traitList))
    },
    
    
    showInfo(n) {
      document.getElementById(n).classList.toggle('hidden')
    },
    
    showTraitAdd(n) {
      document.getElementById('a_'+n).classList.toggle('hidden')
    },
    
    
    //return elements whose 'person' property matches a person time data
    displayTraits(id) {
      return this.traitList.filter((trait) => trait.person == id)
    }
  },
  
  
  mounted() {
    //initialize 'peopleStorage' localStorage data into vue data property: peopleList
    //First check if data is stored
    if (localStorage.getItem("peopleStorage") !== null) {
      let data = JSON.parse(localStorage.getItem("peopleStorage"))
      data.forEach((element) => {
        this.peopleList.push(element)
      })
    }
    
    //push traits in storage to traitList
    if (localStorage.getItem("traitStorage") !== null) {
      let traits = JSON.parse(localStorage.getItem("traitStorage"))
      traits.forEach((element) => {
        this.traitList.push(element)
      })
    }
  }
}).mount('body')
