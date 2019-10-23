import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"; // Don't worry about red lines here ...

interface IRecord {
    title: string;
    artist: string;
    duration: TimeRanges;
    dateOfPublication: string;
    id: number;
}

let baseUri: string = "https://recordsrest.azurewebsites.net/api/records"

let getAllButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getAllButton");
let getOneButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getOneButton");
let addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");
let deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteButton");
let updateButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("updateButton");
let titleSearchButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("titleSearchButton");
let artistSearchButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("artistSearchButton");


getAllButton.addEventListener("click", getAllRecords);
getOneButton.addEventListener("click", getOneRecord);
deleteButton.addEventListener("click", deleteRecord);
addButton.addEventListener("click", addRecord);
updateButton.addEventListener("click", updateRecord);
titleSearchButton.addEventListener("click", getByTitle);
artistSearchButton.addEventListener("click", getByArtist);

let searchList: HTMLDivElement = <HTMLDivElement>document.getElementById("searchList")

let recordList: HTMLDivElement = <HTMLDivElement>document.getElementById("recordList");

function getAllRecords(): void {
    axios.get<IRecord[]>(baseUri)
        .then(function (response: AxiosResponse<IRecord[]>): void {
            let result: string = "<ul>";
            response.data.forEach((record: IRecord) => {
                result += "<li>" + record.id + " - " + record.title + " - " + record.artist + " - " + record.duration + " - " + record.dateOfPublication.split("T")[0];
            });
            result += "</ul>";
            recordList.innerHTML = result;
        })
        .catch(function (error: AxiosError): void {
            recordList.innerHTML = error.message;
        });
}

function getOneRecord(): void {
    let getOneInput: HTMLInputElement = <HTMLInputElement>document.getElementById("getOneInput");
    let oneRecord: HTMLDivElement = <HTMLDivElement>document.getElementById("oneRecord");
    let statusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("statusCode");
    let id: string = getOneInput.value;
    let uri: string = baseUri + "/" + id;
    axios.get<IRecord>(uri)
        .then(function (response: AxiosResponse<IRecord>): void {
            let result: string = response.data.id + " - " + response.data.title + " - " + response.data.artist + " - " + response.data.duration + " - " + response.data.dateOfPublication.split("T")[0];
            oneRecord.innerHTML = result;
            statusCode.innerHTML = response.status + " " + response.statusText;
        })
        .catch(function (error: AxiosError): void {
            statusCode.innerHTML = error.message;
        });
}

function addRecord(): void{
    let titleInput: HTMLInputElement = <HTMLInputElement>document.getElementById("titleInput");
    let artistInput: HTMLInputElement = <HTMLInputElement>document.getElementById("artistInput");
    let durationInput: HTMLInputElement = <HTMLInputElement>document.getElementById("durationInput");
    let dateInput: HTMLInputElement = <HTMLInputElement>document.getElementById("dateInput");
    let titleString: string = titleInput.value;
    let artistString: string = artistInput.value;
    let durationArray: Array<string> = durationInput.value.split(":");
    let durationString: string;
    if (durationArray.length < 3) {
        durationString = "00:" + durationInput.value.split(":")[0] + ":" + durationInput.value.split(":")[1];
    }
    else{
        durationString = durationInput.value.split(":")[0] + ":" + durationInput.value.split(":")[1] + ":" + durationInput.value.split(":")[2];
    }
    let dateString: string = dateInput.value;
    let statusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("addStatusCode");
    axios.post<IRecord>(baseUri, { title: titleString, artist: artistString, duration: durationString, dateOfPublication: dateString})
        .then((response: AxiosResponse) => {
            let message: string = "response: " + response.status + " " + response.statusText;
            console.log(message);
        })
        .catch(function (error: AxiosError): void {
            statusCode.innerHTML = error.message;
        });
}

function updateRecord(): void{
    let titleInput: HTMLInputElement = <HTMLInputElement>document.getElementById("titleInput");
    let artistInput: HTMLInputElement = <HTMLInputElement>document.getElementById("artistInput");
    let durationInput: HTMLInputElement = <HTMLInputElement>document.getElementById("durationInput");
    let dateInput: HTMLInputElement = <HTMLInputElement>document.getElementById("dateInput");
    let titleString: string = titleInput.value;
    let artistString: string = artistInput.value;
    let durationArray: Array<string> = durationInput.value.split(":");
    let durationString: string;
    if (durationArray.length < 3) {
        durationString = "00:" + durationInput.value.split(":")[0] + ":" + durationInput.value.split(":")[1];
    }
    else{
        durationString = durationInput.value.split(":")[0] + ":" + durationInput.value.split(":")[1] + ":" + durationInput.value.split(":")[2];
    }
    let dateString: string = dateInput.value;
    let statusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("addStatusCode");
    let updateID: HTMLInputElement = <HTMLInputElement>document.getElementById("updateID");
    let id: string = updateID.value;
    let uri: string = baseUri + "/" + id;
    axios.put<IRecord>(uri, { title: titleString, artist: artistString, duration: durationString, dateOfPublication: dateString, id: id})
        .then((response: AxiosResponse) => {
            let message: string = "response: " + response.status + " " + response.statusText;
            console.log(message);
        })
        .catch(function (error: AxiosError): void {
            statusCode.innerHTML = error.message;
        });
}

function deleteRecord(): void {
    let deleteInput: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
    let deleteStatusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("deleteStatusCode");
    let id: string = deleteInput.value;
    let uri: string = baseUri + "/" + id;
    axios.delete(uri)
        .then(function (response: AxiosResponse<IRecord>): void {
            deleteStatusCode.innerHTML = response.status + " " + response.statusText;
        })
        .catch(function (error: AxiosError): void {
            deleteStatusCode.innerHTML = error.message;
        });
}

function getByTitle(): void {
    let titleSearchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("titleSearchInput");
    let statusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("searchStatusCode");
    let title: string = titleSearchInput.value;
    let uri: string = baseUri + "/title/" + title;
    axios.get<IRecord[]>(uri)
        .then(function (response: AxiosResponse<IRecord[]>): void {
            let result: string = "<ul>";
            response.data.forEach((record: IRecord) => {
                result += "<li>" + record.id + " - " + record.title + " - " + record.artist + " - " + record.duration + " - " + record.dateOfPublication.split("T")[0];
            });
            result += "</ul>";
            searchList.innerHTML = result;
        })
        .catch(function (error: AxiosError): void {
            statusCode.innerHTML = error.message;
        });
}

function getByArtist(): void{
    let artistSearchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("artistSearchInput");
    let statusCode: HTMLDivElement = <HTMLDivElement>document.getElementById("searchStatusCode");
    let artist: string = artistSearchInput.value;
    let uri: string = baseUri + "/artist/" + artist;
    axios.get<IRecord[]>(uri)
        .then(function (response: AxiosResponse<IRecord[]>): void {
            let result: string = "<ul>";
            response.data.forEach((record: IRecord) => {
                result += "<li>" + record.id + " - " + record.title + " - " + record.artist + " - " + record.duration + " - " + record.dateOfPublication.split("T")[0];
            });
            result += "</ul>";
            searchList.innerHTML = result;
        })
        .catch(function (error: AxiosError): void {
            statusCode.innerHTML = error.message;
        });
}
