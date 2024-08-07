import { AllCoursesPage } from "./connect-backend/AllCoursesPage";
import { AllPathwaysPage } from "./connect-backend/AllPathwaysPage";
import { AllProjectsPage } from "./connect-backend/AllProjectsPage";
import { AllTutorialsPage } from "./connect-backend/AllTutorialsPage";
import { LoginView } from "./connect-backend/LoginView.component";
import { HeaderOfAnyPage } from "./connect-backend/HeaderOfAnyPage";
import { HomePage } from "./connect-backend/HomePage";
import { LivePage } from "./connect-backend/LivePage";
import { SearchResultsPage } from "./connect-backend/SearchResultsPage";
import { TutorialWidget } from "../Widgets/TutorialWidget";
import { MyLearningPage } from "./connect-backend/MyLearningPage";
import { Cookie } from "./connect-backend/Cookie.component";
import { SingleCoursePage } from "./connect-backend/SingleCoursePage";

export class PageManager {
  constructor(page) {
    this.cookies = new Cookie(page);
    this.header = new HeaderOfAnyPage(page);
    this.loginView = new LoginView(page, true);
    this.tutorial = new TutorialWidget(page);
    this.homePage = new HomePage(page);
    this.myLearningPage = new MyLearningPage(page);
    this.searchResultsPage = new SearchResultsPage(page);
    this.livePage = new LivePage(page);
    this.allCoursesPage = new AllCoursesPage(page);
    this.allPathwaysPage = new AllPathwaysPage(page);
    this.allProjectsPage = new AllProjectsPage(page);
    this.allTutorialsPage = new AllTutorialsPage(page);
    this.projectSubmissionPage = new SingleCoursePage(page);
  }
}
