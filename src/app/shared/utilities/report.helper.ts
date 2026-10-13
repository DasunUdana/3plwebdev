import { environment } from '../../../environments/environment';

const getReportUrl = (): string => {
	return (location.host.toLocaleLowerCase().includes('.local') ?
		environment.localReportHostUrl : environment.reportHostUrl) + '/';
};

export { getReportUrl };
