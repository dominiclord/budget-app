import Ractive from 'ractive';
import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import CreateTransactionComponent from './transaction/create';

var component = CreateTransactionComponent();

export default function HomePage(HomeView) {
    var Page = Ractive.components.HomePage = HomeView.extend({
        data: {
            info: 'Hello world.'
        },
        components: {
            CreateTransactionComponent: component
        }
    });
    Page._name = 'HomePage';
    return Page;
}
