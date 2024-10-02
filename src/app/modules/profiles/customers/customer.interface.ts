import { FormControl } from '@angular/forms';
import { IAction } from '../../../components/table/action.interface';

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  avatar: string;
  status: boolean;
  created: string;
  updated: string;
  actions?: IAction[];
}

export interface IFormCustomer {
  id: FormControl<string>;
  name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  country: FormControl<string>;
  status: FormControl<boolean>;
}

export const customers: ICustomer[] = [
  {
    id: '1',
    name: 'Tech Innovations',
    email: 'contact@techinnovations.com',
    phone: '123-456-7890',
    address: '123 Tech St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Innovations',
    status: true,
    created: '2024-01-01T10:00:00Z',
    updated: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Creative Solutions',
    email: 'info@creativesolutions.com',
    phone: '098-765-4321',
    address: '456 Creative Blvd',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Creative+Solutions',
    status: true,
    created: '2024-01-02T10:00:00Z',
    updated: '2024-01-02T10:00:00Z',
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'support@globalenterprises.com',
    phone: '555-555-5555',
    address: '789 Global Ave',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Global+Enterprises',
    status: false,
    created: '2024-01-03T10:00:00Z',
    updated: '2024-01-03T10:00:00Z',
  },
  {
    id: '4',
    name: 'Innovative Designs',
    email: 'sales@innovativedesigns.com',
    phone: '444-444-4444',
    address: '101 Design Rd',
    city: 'Houston',
    state: 'TX',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Innovative+Designs',
    status: true,
    created: '2024-01-04T10:00:00Z',
    updated: '2024-01-04T10:00:00Z',
  },
  {
    id: '5',
    name: 'NextGen Tech',
    email: 'info@nextgentech.com',
    phone: '333-333-3333',
    address: '202 Tech Park',
    city: 'Phoenix',
    state: 'AZ',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=NextGen+Tech',
    status: false,
    created: '2024-01-05T10:00:00Z',
    updated: '2024-01-05T10:00:00Z',
  },
  {
    id: '6',
    name: 'Bright Future Co.',
    email: 'contact@brightfuture.com',
    phone: '222-222-2222',
    address: '303 Future Way',
    city: 'Philadelphia',
    state: 'PA',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Bright+Future+Co.',
    status: true,
    created: '2024-01-06T10:00:00Z',
    updated: '2024-01-06T10:00:00Z',
  },
  {
    id: '7',
    name: 'Apex Industries',
    email: 'support@apexindustries.com',
    phone: '111-111-1111',
    address: '404 Apex Blvd',
    city: 'San Antonio',
    state: 'TX',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Apex+Industries',
    status: false,
    created: '2024-01-07T10:00:00Z',
    updated: '2024-01-07T10:00:00Z',
  },
  {
    id: '8',
    name: 'Visionary Solutions',
    email: 'info@visionarysolutions.com',
    phone: '999-999-9999',
    address: '505 Vision St',
    city: 'San Diego',
    state: 'CA',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Visionary+Solutions',
    status: true,
    created: '2024-01-08T10:00:00Z',
    updated: '2024-01-08T10:00:00Z',
  },
  {
    id: '9',
    name: 'Elite Enterprises',
    email: 'sales@eliteenterprises.com',
    phone: '888-888-8888',
    address: '606 Elite Dr',
    city: 'Dallas',
    state: 'TX',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Elite+Enterprises',
    status: false,
    created: '2024-01-09T10:00:00Z',
    updated: '2024-01-09T10:00:00Z',
  },
  {
    id: '10',
    name: 'Prime Innovations',
    email: 'contact@primeinnovations.com',
    phone: '777-777-7777',
    address: '707 Prime Blvd',
    city: 'San Jose',
    state: 'CA',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Prime+Innovations',
    status: true,
    created: '2024-01-10T10:00:00Z',
    updated: '2024-01-10T10:00:00Z',
  },
  {
    id: '11',
    name: 'Synergy Solutions',
    email: 'info@synergysolutions.com',
    phone: '666-666-6666',
    address: '808 Synergy St',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Synergy+Solutions',
    status: false,
    created: '2024-01-11T10:00:00Z',
    updated: '2024-01-11T10:00:00Z',
  },
  {
    id: '12',
    name: 'Innovative Concepts',
    email: 'support@innovativeconcepts.com',
    phone: '555-555-5555',
    address: '909 Concept Blvd',
    city: 'Jacksonville',
    state: 'FL',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Innovative+Concepts',
    status: true,
    created: '2024-01-12T10:00:00Z',
    updated: '2024-01-12T10:00:00Z',
  },
  {
    id: '13',
    name: 'Dynamic Ventures',
    email: 'info@dynamicventures.com',
    phone: '444-444-4444',
    address: '1010 Venture Rd',
    city: 'Fort Worth',
    state: 'TX',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Dynamic+Ventures',
    status: false,
    created: '2024-01-13T10:00:00Z',
    updated: '2024-01-13T10:00:00Z',
  },
  {
    id: '14',
    name: 'Alpha Tech',
    email: 'contact@alphatech.com',
    phone: '333-333-3333',
    address: '1111 Alpha St',
    city: 'Columbus',
    state: 'OH',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Alpha+Tech',
    status: true,
    created: '2024-01-14T10:00:00Z',
    updated: '2024-01-14T10:00:00Z',
  },
  {
    id: '15',
    name: 'Titan Enterprises',
    email: 'sales@titanenterprises.com',
    phone: '222-222-2222',
    address: '1212 Titan Blvd',
    city: 'Charlotte',
    state: 'NC',
    country: 'USA',
    avatar: 'https://ui-avatars.com/api/?name=Titan+Enterprises',
    status: false,
    created: '2024-01-15T10:00:00Z',
    updated: '2024-01-15T10:00:00Z',
  },
];
