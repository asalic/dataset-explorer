import DataManager from "../../../api/DataManager";
import MainView from "../common/main/MainView";
import SingleDataType from "../../../model/SingleDataType";

interface DatasetsMainViewProps {
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
    activeTab?: string;
    showDialog: Function;
  }
  
function DatasetsMainView(props: DatasetsMainViewProps) {

  return <MainView singleDataType={SingleDataType.DATASET} keycloakReady={props.keycloakReady} 
    dataManager={props.dataManager} postMessage={props.postMessage} 
    activeTab={props.activeTab} showDialog={props.showDialog}/>

}

export default DatasetsMainView;