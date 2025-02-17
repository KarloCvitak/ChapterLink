import {Component, OnInit} from '@angular/core';
import {UserBookService} from "../services/user-book.service";
import {AuthService} from "../services/auth.service";
import {CriticService} from "../services/critic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../services/search.service";
import {LikeService} from "../services/like.service";
import {CustomListsService} from "../services/custom-lists.service";
import {UserService} from "../services/user.service";

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
    private userService: UserService
  ) { }

  userId: any;
  listId: any;
  books: any[] = [];
  list: any;
  user: any = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.listId = params['id'];
      this.customListsService.getAllBooksFromTheList(this.listId).subscribe(listBooks => {

        console.log("listBooks.list " + listBooks.list);
        console.log("listBooks.books " + listBooks.books.Book);
        this.list = listBooks.list;
        this.userId = this.list.user_id;
        this.books = listBooks.books;
        this.getUserProfile();
      });
    });
  }

  getUserProfile(): void {
    this.userService.getUserById(this.userId).subscribe(response => {
      if (response.status === 'OK') {
        this.user = response.user;
      } else {
        console.error('Error fetching user profile:', response);
      }
    }, error => {
      console.error('HTTP error fetching user profile:', error);
    });
  }


}
