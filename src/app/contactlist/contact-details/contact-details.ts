import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'contact-details',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './contact-details.html',
  styleUrls: ['./contact-details.css'],
})
export class ContactDetailsComponent {
  @Input() contact: Contact | null = null;
  @Input() createHandler!: Function;
  @Input() updateHandler!: Function;
  @Input() deleteHandler!: Function;

  constructor(private contactService: ContactService) {}

  createContact(contact: Contact): void {
    this.contactService.createContact(contact).then((newContact: Contact) => {
      this.createHandler(newContact);
    });
  }

  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact).then((updatedContact: Contact) => {
      this.updateHandler(updatedContact);
    });
  }

  deleteContact(contactId: string): void {
    this.contactService.deleteContact(contactId).then((deletedContactId: string) => {
      this.deleteHandler(deletedContactId);
    });
  }
}
