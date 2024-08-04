import {Component, OnInit} from '@angular/core';
import {UserBookService} from "../services/user-book.service";
import {AuthService} from "../services/auth.service";
import {CriticService} from "../services/critic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../services/search.service";
import {LikeService} from "../services/like.service";
import {CustomListsService} from "../services/custom-lists.service";

@Component({
  selector: 'app-custom-lists',
  templateUrl: './custom-lists.component.html',
  styleUrl: './custom-lists.component.css'
})
export class CustomListsComponent implements OnInit{


  constructor(
    private userBookService: UserBookService,
    private authService: AuthService,
    private criticService: CriticService,
    private router: Router,
    private searchService: SearchService,
    private likesService: LikeService,
    private customListsService: CustomListsService,
    private route: ActivatedRoute,

  ) { }

  userId: any;
  listId: any;
  books: any[] = [];
  list: any;

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.route.params.subscribe(params => {
      this.listId = params['id'];
      this.customListsService.getAllBooksFromTheList(this.listId).subscribe(listBooks => {

        console.log("listBooks.list " + listBooks.list);
        console.log("listBooks.books " + listBooks.books.Book);

        this.list = listBooks.list;
        this.books = listBooks.books;

      });
    });
  }


}
