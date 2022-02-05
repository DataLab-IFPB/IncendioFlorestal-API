import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showMessage(severity: string, summary: string, detail?: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 5000,
      sticky: false,
      closable: true,
    });
  }
}
