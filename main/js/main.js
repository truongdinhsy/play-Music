/** việc phải làm 
 * khi mà nghe một bài bất mà nhấn ran dom thì sẽ bắt đầu từ bài đó: xong 
 * làm nút edit
 * hiển thị bài hát dg nghe ở phần list: xong 
 * làm cái nút đê thu nhỏ thay cho dasbards: xong 
 * view active center theo active: xong
 * làm phần âm lượng cho pc: xong 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * làm phần cho mobile
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


/** lỗi 
 * auto next khi bài đang chạy : xong 
 * khi đang chạy mà nhấn nút random thì load lại từ đầu: xong 
 * khi dang chạy mà ramdom rồi tắt random rồi random xong nhấn next sẽ lỗi 
 * cd thumb phải load lại khi next: xong
 * fix cái thanh dộ dài bài hát: xong
 * nếu dg nghe một bài bất kì mà nhấn random thì lỗi mất bài hát: xong 
 * khi random thì không active bài đầu tiên mà active vị trí dg được active: xong
 * 
 * 
 * 
 * 
 */
const songsUrl = 'http://localhost:3000/songs';
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var cd = $('.cd');
const heading = $('header h2');
const cdThunb = $('.cd .cd-thumb');
const audio = $('#audio');
const togglePlay = $('.btn-toggle-play');
var currentIndex = 0;
const player = $('.player');
const btnrandom = $('.btn-random');
const progress = $('#progress');
const btnvolume = $('.btn-volume');
const volumehigh = $('.fa-volume-high');
const volumemute = $('.fa-volume-xmark');
const btnnext = $('.btn-next');
const btnprev = $('.btn-prev');
const playlist = $('.playlist')
const cdWidth = cd.offsetWidth;
const btnrepeat = $('.btn-repeat');
const btnellipsis = $('.btn-ellipsis');
const checkfachevron = $('.check-chevron');
const inputvolume = $('#volume');
const volumelow = $('.fa-volume-low');
const btnplus = $('.add-Song');
const addSong = $('.Sl-add');
const addSonglink = $('.add-Song--link');
const addsongnor = $('.add-song--nor');
const formaddurl = $('#form-add--url');
const formaddor = $('#form-add--nm');
const btnaddSongUrl = $('#form-add--url .btn-add--song ');
const btnaddSongNor = $('#form-add--nm .btn-add--song ');
const xMart = $('#form-add--url .X-mart');
const xMartnor = $('#form-add--nm .X-mart');


function getApiSongs(callback) {  // gọi api
    fetch(songsUrl)
        .then(songs => songs.json())
        .then(data => {
            callback(data)
        })
        .catch(err => console.log(err));
}
function getDatasApi(data) {
    return data
}
function displayFileName(input) {
    var filePath = input.value;
    var lastIndex = filePath.lastIndexOf('\\');
    var fileName = filePath.substring(lastIndex + 1);
    return fileName
}


const app = {
    songs: [],
    currentIndex: 0,
    isplaying: false,
    israndom: false,
    isrepeat: false,
    ischeckW: false,
    render: function () {
        const _this = this;

        const htmls = this.songs.map(function (song, index) {
            return `
            <div  class="song " data-index="${index}" id ="${song.id}">
                    <div class="thumb"
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.author}</p>
                    </div>
                  
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="options-song">
                        <div class="btnS delete-song">
                        Xoá
                        </div>
                        <div class="btnS edit-song">
                        Edit
                        </div>
                    </div>
                </div>

            
            `
        });

        playlist.innerHTML = htmls.join('');

    },

    defineProperties: function () {//lấy ra phần tử đầu tiên 
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },



    handleEvents: function () { //sử lý
        const _this = this;


        btnellipsis.addEventListener('click', function () { // sử lý đóng mở dasboards

            if (!_this.ischeckW) {

                cd.style.width = 0 + 'px';
                playlist.style.marginTop = 200 + 'px';
                _this.ischeckW = true;
                checkfachevron.classList.remove('fa-chevron-up');
                checkfachevron.classList.add('fa-chevron-down');
            }
            else {
                _this.ischeckW = false;
                cd.style.width = 200 + 'px';
                playlist.style.marginTop = 408 + 'px';

                checkfachevron.classList.remove('fa-chevron-down');
                checkfachevron.classList.add('fa-chevron-up');
            }

        });



        const cdThunbanimate = cdThunb.animate(
            [
                { transform: 'rotate(0deg)' }, // bắt đầu từ không 
                { transform: 'rotate(360deg)' } // Rotate quay tròn 
            ],
            {
                duration: 300000, //thời gian quay hết một vòng 
                iterations: Infinity // lặp lại vo hạn 
            }
        );
        cdThunbanimate.pause();


        togglePlay.onclick = function () {// play nhac

            if (_this.isplaying) { // kiểm tra isplaying có bằng true hay không
                audio.pause(); // audio.dừng 
            }
            else {
                audio.play(); // audio chạy

            }
            audio.ontimeupdate = function () { //lấy thời gian audio thay đổi 
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            progress.addEventListener('input', function () { // gán sự kiện đầu vào 
                var seektime = (progress.value / 100) * audio.duration; // tính thời gian để lấy ra phần trăm của bài hát 
                audio.currentTime = seektime;// gán thời gian hiện tại cho seekTime
            });

        };



        btnnext.addEventListener('click', function () { // gán sự kiện click cho nextSong
            _this.nextSong();// gọi hàm nextSong
            audio.play(); // chạy bài nhạc

            if (cdThunbanimate) {
                // Hủy animation hiện tại và bắt đầu lại từ đầu
                cdThunbanimate.cancel();
                cdThunbanimate.play();
            }
            else {
                // Nếu chưa khởi tạo, thì khởi tạo và bắt đầu animation
                this.cdThunbanimate.play();
            }
        });
        btnprev.addEventListener('click', function () {// gán sự kiện click cho prevSong
            _this.prevSong();// gọi hàm prevSong
            audio.play();// chạy bài nhạc

            if (cdThunbanimate) {

                // Hủy animation hiện tại và bắt đầu lại từ đầu
                cdThunbanimate.cancel();
                cdThunbanimate.play();
            }
            else {
                // Nếu chưa khởi tạo, thì khởi tạo và bắt đầu animation
                this.cdThunbanimate.play();
            }

        });

        btnrandom.addEventListener('click', function () {

            _this.randomsongs();
            _this.currentIndex = 0;
            _this.onloadSong();
            if (cdThunbanimate) {

                // Hủy animation hiện tại và bắt đầu lại từ đầu
                cdThunbanimate.cancel();
                cdThunbanimate.play();
            }
            else {
                // Nếu chưa khởi tạo, thì khởi tạo và bắt đầu animation
                this.cdThunbanimate.play();
            }
        });
        btnvolume.addEventListener('click', function () {
            _this.togglevolum()

        });
        btnrepeat.addEventListener('click', function () {
            _this.ischeckrepeat = !_this.isrepeat
            _this.repeatSong();
        })


        audio.onended = function () {

            if (!_this.isrepeat) {
                _this.nextSong();
                _this.loadCurrentSongs();

                audio.play();
                if (cdThunbanimate) {

                    // Hủy animation hiện tại và bắt đầu lại từ đầu
                    cdThunbanimate.cancel();
                    cdThunbanimate.play();
                }
                else {
                    // Nếu chưa khởi tạo, thì khởi tạo và bắt đầu animation
                    this.cdThunbanimate.play();
                }
            }


        }

        playlist.onclick = function (event) {
            const allsong = event.target.closest('.song');
            const notActive = event.target.closest('.song:not(.active)');
            const notdelete = event.target.closest('.options-song');
            const notOption = event.target.closest('.option')

            if (notActive || notOption) {



                if (notActive) { // sử lý bài hát 
                    if (!notOption && !notdelete) {

                        _this.currentIndex = Number(notActive.dataset.index);
                        _this.loadCurrentSongs();
                        audio.play();

                    }
                }



                //sử lý option
                if (notOption) {
                    const editsong = $$('.options-song')

                    for (let i = 0; i < _this.songs.length; i++) {
                        if (Number(allsong.dataset.index) === i) {
                            editsong[i].style.display = 'block';
                            if (editsong[i].style.display === 'block') {
                                window.addEventListener('scroll', function () {
                                    if (window.scrollY > 50 || window.scrollY === -100) {// thằng này chưa biết  window.scrollY === -100
                                        editsong[i].style.display = 'none';
                                    }
                                });
                                setTimeout(function () {
                                    editsong[i].style.display = 'none';
                                }, 3000);
                            }
                            // sử lý xoá 
                            if (editsong[i]) {
                                var deleteSong = editsong[i].querySelector('.delete-song')// lấy class con của song
                                deleteSong.addEventListener('click', function () {

                                    if (_this.songs[i].id) {
                                        var deleteApi = songsUrl + `/` + _this.songs[i].id
                                        fetch(deleteApi, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                // Các headers khác nếu cần thiết
                                            },
                                        })
                                            .then(response => {
                                                if (!response.ok) {
                                                    throw new Error('Network response was not ok');
                                                }
                                                return response.json();
                                            })
                                            .then(data => {
                                                alert('đã xoá thành công', data)
                                            })
                                            .catch(error => {
                                                console.error('Có lỗi xảy ra:', error);
                                            });

                                        editsong[i].style.display = 'none';
                                    }
                                });
                            }

                        }

                    }




                }

            }

        }

        inputvolume.addEventListener('input', function () {

            audio.volume = inputvolume.value / 100;
            if (audio.volume === 0) {

                volumehigh.style.display = 'none'
                volumelow.style.display = 'none';
                volumemute.style.display = 'block';

            }
            if (audio.volume > 0) {
                if (inputvolume.value < 50) {
                    volumehigh.style.display = 'none'
                    volumelow.style.display = 'block'

                }
                else {
                    volumehigh.style.display = 'block'
                    volumelow.style.display = 'none';

                }
                volumemute.style.display = 'none';

            }
        })



        btnplus.addEventListener('click', function () {

            if (formaddurl.style.display === 'block' || formaddor.style.display === 'block') {
                addSong.style.display = 'none';

            }
            else {
                if (addSong.style.display === 'none') {
                    addSong.style.display = 'block';

                }
                else {
                    addSong.style.display = 'none';
                }
            }



        })

        addSonglink.addEventListener('click', function () {
            // sử lý 


            // ẩn 
            formaddurl.style.display = 'block';
        });

        addsongnor.addEventListener('click', function () {
            // sử lý 

            // ẩn 

            formaddor.style.display = 'block';

        });
        btnaddSongUrl.addEventListener('click', function () {
            // sử lý 



            // ẩn    
            formaddurl.style.display = 'none';
        });

        btnaddSongNor.addEventListener('click', function () {
            //sử lý 

            _this.addSongNor();

            //ẩn  
            formaddor.style.display = 'none';
        });

        xMart.onclick = function () {

            formaddurl.style.display = 'none';
        };
        xMartnor.onclick = function () {

            formaddor.style.display = 'none';
        };




        audio.onplay = function () { // khi bài hát được phát 
            _this.isplaying = true; // gán isplaying bằng true
            player.classList.add('playing');// thêm class playing 
            cdThunbanimate.play();// chạy animate của thumb



        };
        audio.onpause = function () {// khi dừng 
            _this.isplaying = false;   // gán bằng false
            player.classList.remove('playing');// gỡ class playing
            cdThunbanimate.pause();// dừng naimate thumb

        };


    },

    nextSong: function () {// hàm nextSong 
        this.currentIndex++; // vị trí bài hát cộng thêm một 
        if (this.currentIndex >= this.songs.length) { // nếu vị trí mà lớn hơn tổng bài số bài 
            this.currentIndex = 0; // gán bằng vị trí đầu tiên

        }
        this.loadCurrentSongs();// gọi hàm loadCurrentSongs()

    },
    prevSong: function () {// hàm prevSong
        this.currentIndex--;// vị trí bài hát trừ đi 1 
        if (this.currentIndex < 0) { // vị trí bài mà là số âm
            this.currentIndex = this.songs.length - 1; // gán nó cho bài cuối cùng 
        }
        this.loadCurrentSongs();// gọi hàm loadCurrentSongs()

    },


    // random vaf load lại bài hát 
    randomsongs: function () {
        this.israndom = !this.israndom;
        btnrandom.classList.toggle('active', this.israndom);
        var isactive = btnrandom.classList.contains('active');
        // this.currentIndex = 0;
        this.loadCurrentSongs();
        var ramdomArray = [];
        for (var i = 0; i <= this.songs.length - 1; i++) { // qua để lấy từng phần tử trong mảng 
            ramdomArray.push(i);// truyền i văo mảng 
            var j = Math.floor(Math.random() * (i));// random số với giá trị của mảng cộng thêm 1
            [ramdomArray[i], ramdomArray[j]] = [ramdomArray[j], ramdomArray[i]]// hoán đổi giá trị của phần tử trong mảng bằng với giá trị đã random
        }

        var findrdArray = ramdomArray.indexOf(this.currentIndex);
        if (findrdArray !== -1) {
            // Tìm vị trí của số 0 trong mảng và hoán đổi với vị trí của this.currentIndex
            var indexOfZero = ramdomArray.indexOf(0);
            [ramdomArray[indexOfZero], ramdomArray[this.currentIndex]] = [ramdomArray[this.currentIndex], ramdomArray[indexOfZero]];// số 0 đổi cho cho this.curentSomg 
        }

        // Bây giờ findrdArray luôn ở vị trí đầu tiên nếu nó tồn tại trong mảng


        var newArraySong = this.songs; // gán newArraySong bằng mảng của bài hát gốc
        var tempArray = ramdomArray.map(function (value, index) {// Tạo một mảng tạm thời chứa cả hai giá trị
            return { SongA: value, SongB: newArraySong[index] }; // trả vè mảng tạm thời chứ hai mảng đã random và mảng gốc
        });

        tempArray.sort(function (a, b) { // hoán đổi giá trị của từng phần tử mảng đã random cho vị trí mảng gốc
            return a.SongA - b.SongA;
        });
        newArraySong = tempArray.map(function (item) {// trả vẻ mảng chứa bài hát đã hoáng đổi 
            return item.SongB;
        });


        if (isactive) {// kiểm tra nút ram dom có được active hay không 
            if (this.isplaying) {
                this.loadCurrentSongs();
                audio.play();
            }
            this.songs = newArraySong;
            audio.play();
            this.render()


        } else {
            if (this.isplaying) {
                this.loadCurrentSongs();
                this.songs = this.originalSongs.slice();
            }
            this.songs = this.originalSongs.slice();
            audio.pause();
            this.render();
        }

    },

    repeatSong: function () {

        this.isrepeat = !this.isrepeat;
        btnrepeat.classList.toggle('active', this.isrepeat);

        audio.addEventListener('ended', function () {
            audio.play();
        })


    },
    activeView: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300)

    },
    onloadSong: function () {
        const songActive = $$('.song');

        for (let i = 0; i < songActive.length; i++) {

            if (this.currentIndex === i) {
                songActive[i].classList.add('active');
            } else {
                songActive[i].classList.remove('active');
            }
        }

    },

    addSongLink: function () {





    },
    addSongNor: function () {


        var dataform;
        var checkimage;
        var checkmp3;
        const selectAllinput = formaddor.querySelectorAll('.input-add--song')

        for (let i = 0; i < selectAllinput.length; i++) {
            if (selectAllinput[i]) {
                if (selectAllinput[3].value.toLowerCase().endsWith('.mp3')) {

                    checkmp3 = displayFileName(selectAllinput[3]);

                }
                if (selectAllinput[2].value.toLowerCase().endsWith('.png') || selectAllinput[2].value.toLowerCase().endsWith('.jpg')) {
                    checkimage = displayFileName(selectAllinput[2]);
                }
                dataform = { img: `/img/${checkimage}`, name: selectAllinput[0].value, author: selectAllinput[1].value, path: `/music/${checkmp3}` }
            }
        }

        if (checkimage === undefined) {
            alert('hãy chọn đúng file mp3 ')
        }
        if (checkimage === undefined) {
            alert('hãy chọn đúng file image ')
        }
        else {



            // post dữ liệu 
            var dataJson = JSON.stringify(dataform);
            fetch(songsUrl, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: dataJson
            })
                .then(data => data.json())
                .then(data => console.log('Success:', data))
                .catch(err => console.log('Error:', err));
        }


    },


    loadCurrentSongs: function () { // bài hát đang được lấy ra 
        heading.textContent = this.currentSong.name // tên của bài hát 
        cdThunb.style.backgroundImage = `url(${this.currentSong.img})`;// link ảnh cho thumb
        audio.src = this.currentSong.path;// đường dẫn bài hất 
        this.onloadSong();
        this.activeView();

    },




    togglevolum: function () {


        if (volumehigh.style.display === 'block' || volumelow.style.display === 'block') {
            volumehigh.style.display = 'none'
            volumelow.style.display = 'none'
            audio.volume = 0;
            volumemute.style.display = 'block';
        }
        else {
            if (inputvolume.value > 50) {
                volumehigh.style.display = 'block'
            }
            else {
                volumelow.style.display = 'block';
            }
            volumemute.style.display = 'none';
            audio.volume = inputvolume.value / 100;

        }

    },



    start: function () {
        // Gọi getApiSongs và truyền callback là getDatasApi
        getApiSongs(data => {
            // Gán dữ liệu vào thuộc tính songs của app
            this.songs = getDatasApi(data);
            // Gọi hàm render để hiển thị dữ liệu
            this.originalSongs = getDatasApi(data) || [];
            this.songs = this.originalSongs.slice();
            this.render();
            this.defineProperties();
            this.loadCurrentSongs();


        });

        this.handleEvents();


    },

};
app.start();




