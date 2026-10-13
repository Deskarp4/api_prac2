import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'contact-list',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
  providers: [ContactService],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.contactService.getContacts().then((contacts: Contact[]) => {
      this.contacts = contacts.map((contact) => {
        if (!contact.phone) {
          contact.phone = { mobile: '', work: '' };
        }
        return contact;
      });
      this.changeDetector.markForCheck();
    });
  }

  private getIndexOfContact = (contactId: string | undefined) => {
    return this.contacts.findIndex((contact) => contact._id === contactId);
  };

  selectContact(contact: Contact | null): void {
    this.selectedContact = contact;
  }

  createNewContact(): void {
    var contact: Contact = {
      name: '',
      email: '',
      phone: { work: '', mobile: '' },
    };
    this.selectContact(contact);
  }

  deleteContact = (contactId: string) => {
    var idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
    this.changeDetector.markForCheck();
    return this.contacts;
  };

  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
    this.changeDetector.markForCheck();
    return this.contacts;
  };

  updateContact = (contact: Contact) => {
    var idx = this.getIndexOfContact(contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    this.changeDetector.markForCheck();
    return this.contacts;
  };
}
