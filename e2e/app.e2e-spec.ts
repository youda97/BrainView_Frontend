import { BrainViewPage } from './app.po';

describe('brain-view App', () => {
	let page: BrainViewPage;

	beforeEach(() => {
		page = new BrainViewPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
