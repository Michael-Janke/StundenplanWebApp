import dataService from "./data-service";
import profilePictureService from "./profilePictureService";
import teamsService from "./teams-service";
import postsService from "./posts-service";
import datesService from "./dates-service";
import periodService from "./period-service";
import authenticationService from "./authentication-service";

export default [
    authenticationService,
    dataService,
    profilePictureService,
    teamsService,
    postsService,
    datesService, 
    periodService
];