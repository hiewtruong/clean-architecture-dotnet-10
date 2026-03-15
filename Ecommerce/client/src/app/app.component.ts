import { Component, OnInit } from '@angular/core';
import { AcntService } from './account/acnt.service';
import { BasketService } from './basket/basket.service';
import { MsalService } from '@azure/msal-angular';
import { BrowserCacheLocation, PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eShopping';

  constructor(
    private basketService: BasketService, 
    private acntService: AcntService,
    private msalService: MsalService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeMsal();
    // Handle MSAL redirect response
    this.msalService.instance.handleRedirectPromise().then((result) => {
      if (result && result.account) {
        console.log('Login successful:', result);
        // Navigate to the state URL if it exists
        const targetRoute = result.state || '/';
        console.log('Navigating to:', targetRoute);
        this.router.navigate([targetRoute]);
        // Set the active account and update user state
        this.msalService.instance.setActiveAccount(result.account); 
        this.acntService.setUserAfterRedirect(); // Update the user state
      } else {
        console.log('No account in result or no redirect result.');
        this.acntService.setUserAfterRedirect(); // Try to retrieve active account
      }
    }).catch((error) => {
      console.error('Error handling redirect:', error);
    });
    // Existing logic to load the basket
    const basket_username = localStorage.getItem('basket_username');
    if (basket_username) {
      this.basketService.getBasket(basket_username);
    }
  }
  private async initializeMsal(): Promise<void> {
    const pca = new PublicClientApplication({
      auth: {
        clientId: 'ea601a45-1cb3-4f3e-9fec-c47239bb0c4e',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:4200'
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false
      }
    });
    this.msalService.instance = pca;
    await pca.initialize();  // Ensure the instance is initialized before proceeding
  }
}
