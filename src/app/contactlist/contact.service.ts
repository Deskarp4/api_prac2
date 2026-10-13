import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private APIUrl = '/api/contacts';

  constructor(private http: HttpClient) {}

  createContact(newContact: Contact): Promise<Contact> {
    return this.http.post<Contact>(this.APIUrl, newContact)
      .toPromise()
      .then(response => response as Contact)
      .catch(this.handleError);
  }

  getContacts(): Promise<Contact[]> {
    return this.http.get<Contact[]>(this.APIUrl)
      .toPromise()
      .then(response => response as Contact[])
      .catch(this.handleError);
  }

  deleteContact(delContactId: string): Promise<string> {
    return this.http.delete<{ _id: string }>(this.APIUrl + '/' + delContactId)
      .toPromise()
      .then(response => response!._id)
      .catch(this.handleError);
  }

  updateContact(putContact: Contact): Promise<Contact> {
    var putUrl = this.APIUrl + '/' + putContact._id;
    return this.http.put<Contact>(putUrl, putContact)
      .toPromise()
      .then(response => response as Contact)
      .catch(this.handleError);
  }

  private handleError(error: any): never {
    let errMsg = error.message ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Ошибка сервера';
    console.error(errMsg);
    throw error;
  }
}
