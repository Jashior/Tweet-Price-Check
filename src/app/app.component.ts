import { Component } from '@angular/core';
import { ApiHandleService } from './shared/api-handle.service';
import { TwitterHandleService } from './shared/twitter-handle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pricecheck';
  response;
  cryptoId: string = 'ripple';
  date: string = '03-03-2020';

  priceAtDate: number;
  currentPrice: number;

  tweet: { date: string; username: string; text: string } = {
    username: '',
    text: '',
    date: '',
  };

  constructor(
    private apiService: ApiHandleService,
    private twitterService: TwitterHandleService
  ) {}

  getPing() {
    this.apiService.getPing().subscribe((data) => (this.response = data));
  }

  getPrices() {
    this.getPriceAtDate();
    this.getCurrentPrice();
  }

  getPriceAtDate() {
    this.apiService
      .getPriceOfCoinAtDate(this.cryptoId, this.date)
      .subscribe((data) => {
        this.priceAtDate = data['market_data']['current_price']['usd'];
      });
  }

  getCurrentPrice() {
    this.apiService.getCurrentPrice(this.cryptoId).subscribe((data) => {
      this.currentPrice = data['market_data']['current_price']['usd'];
    });
  }

  getTwitterPost() {
    let id = '1392798127133020161';
    console.log(`attempting to get twitter post ${id}`);
    let results;
    this.twitterService.getTweet(id).subscribe((data) => {
      // tweet: { tweetDate: string; tweetUsername: string; tweetText: string };
      this.tweet.username = data['includes']['users'][0]['username'];
      this.tweet.text = data['data'][0]['text'];
      this.tweet.date = data['data'][0]['created_at'];

      console.log(results);
    });
  }
}
