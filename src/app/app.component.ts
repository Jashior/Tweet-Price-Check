import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
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

  finalCoinIds: string[] = [];
  mappedSymbols: any = {};
  coinValues = [];
  initialInvestment = 100;
  investmentValue;

  //testing this
  totalInitialInvestment = 0;

  tweet: { date: string; username: string; text: string } = {
    username: '',
    text: '',
    date: '',
  };

  constructor(
    private apiService: ApiHandleService,
    private twitterService: TwitterHandleService
  ) {}

  ngOnInit() {
    this.apiService.getAllCoins().subscribe((data) => {
      data.forEach((coin) => (this.mappedSymbols[coin.symbol] = coin.id));
    });
  }

  getPing() {
    this.apiService.getPing().subscribe((data) => (this.response = data));
  }

  // getPrices() {
  //   this.getPriceAtDate(this.cryptoId, this.date);
  //   this.getCurrentPrice();
  // }

  // getPriceAtDate(id, date) {
  //   this.apiService.getPriceOfCoinAtDate(id, date).subscribe((data) => {
  //     return data['market_data']['current_price']['usd'];
  //   });
  // }

  // getCurrentPrice() {
  //   this.apiService.getCurrentPrice(this.cryptoId).subscribe((data) => {
  //     this.currentPrice = data['market_data']['current_price']['usd'];
  //   });
  // }

  getTwitterPost() {
    let id = '1392844458065121285';

    console.log(`attempting to get twitter post ${id}`);
    this.twitterService.getTweet(id).subscribe((data) => {
      // Gets the username of the tweeter
      this.tweet.username = data['includes']['users'][0]['username'];

      // Gets the text of the tweet
      this.tweet.text = data['data'][0]['text'];

      console.log(`Transforming date ${data['data'][0]['created_at']}`);

      // Get the date in 03-05-2020 form
      const datePipe = new DatePipe('en-US');
      this.tweet.date = datePipe.transform(
        data['data'][0]['created_at'],
        'dd-MM-yyyy'
      );

      console.log(`Detected date as ${this.tweet.date}`);

      // Once loaded, analyse tweet
      this.analyseTweet();
      // this.loadTickers();
    });
  }

  analyseTweet() {
    // extract coin info from tweet text
    this.loadTickers();

    // evaluate coins at tweet date compared to current date
    this.getCurrentEvaluation();
  }

  loadTickers() {
    console.log(`Attempting to load tickers from tweet text`);

    // Matches all tickers in tweet text e.g. $XRP, $BTC
    const regex = /(^|\s)[\$|\#]([A-Za-z_][A-Za-z0-9_]*)/gm;
    const foundTickers = this.tweet.text.match(regex);

    // Checks tickers exist as a coin in database, load ids of each coin
    for (let ticker of foundTickers) {
      let splicedTicker = ticker
        .replace(/(^\s+|\s+$)/g, '')
        .substring(1)
        .toLowerCase();
      if (splicedTicker in this.mappedSymbols) {
        this.finalCoinIds.push(this.mappedSymbols[splicedTicker]);
      }
    }

    // remove duplicates
    this.finalCoinIds = [...new Set(this.finalCoinIds)];

    console.log(`Final coin Ids: ${this.finalCoinIds}`);
  }

  getCurrentEvaluation() {
    console.log(`Attempting to evaluate difference in value of coins `);

    this.coinValues = [];
    this.investmentValue = 0;

    let investmentPerCoin = this.initialInvestment / this.finalCoinIds.length;
    // let investmentPerCoin = 100;

    for (let coin of this.finalCoinIds) {
      this.apiService
        .getPriceOfCoinAtDate(coin, this.tweet.date)
        .subscribe((oldData) => {
          if (oldData['market_data'] == undefined) {
            console.log(`${coin} returned undefined`);
          } else {
            this.apiService.getCurrentPrice(coin).subscribe((data) => {
              if (data['market_data'] == undefined) {
                console.log(`${coin} returned undefined`);
              } else {
                // Price at tweet date
                let oldCoinPrice =
                  oldData['market_data']['current_price']['usd'];
                // Price at current date
                let currentCoinPrice =
                  data['market_data']['current_price']['usd'];
                // Number of coins bought at tweet date (= (investment per coin) / (coin price at tweet date))
                let coinsBought = investmentPerCoin / oldCoinPrice;
                // Current value of coins bought (= (coins bought at tweet date)*(current value per coin))
                let coinsBoughtValue = coinsBought * currentCoinPrice;

                this.coinValues.push({
                  name: coin,
                  priceAtDate: oldCoinPrice,
                  currentPrice: currentCoinPrice,
                  coinsBought: coinsBought,
                  coinsBoughtValue: coinsBoughtValue,
                  difference: 100 * (currentCoinPrice / oldCoinPrice) - 100,
                });

                // Tally total value of investment
                this.investmentValue += coinsBoughtValue;

                // Tally total amount invested
                this.totalInitialInvestment += investmentPerCoin;
              }
            });
          }
        });
    }
  }
}
