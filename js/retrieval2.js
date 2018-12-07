$(function () {
    var $audio = $('.audio audio')[0],
        $video = $('.video video')[0];

    //媒体控件
    function media($ele) {
        /*总时间和设置进度条*/
        $ele.oncanplay = function () {
            var m, s;
            m = Math.floor($ele.duration / 60);
            s = Math.floor($ele.duration % 60);
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            $ele === $audio ? $('.audio .dur').text(m + ':' + s) : $('.controls .dur').text(m + ':' + s);
        };

        /*进度条和时间同步*/
        $ele.ontimeupdate = function () {
            var value = 0, m, s;
            if ($ele.currentTime > 0) {
                value = $ele.currentTime / $ele.duration * 100;
            }
            $ele === $audio ? $('.audio .progress span').css("width", value + '%') : $('.controls .progress span').css("width", value + '%');
            m = Math.floor($ele.currentTime / 60);
            s = Math.floor($ele.currentTime % 60);
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            $ele === $audio ? $('.audio .cur').text(m + ':' + s) : $('.controls .cur').text(m + ':' + s);
        };
        /*点击进度条改变*/
        if ($ele === $audio) {
            var $play = $('.audio .play'),
                $pause = $('.audio .pause'),
                $progress = $('.audio .progress');
            /*设置播放和暂停*/
            $play.click(function () {
                $play.toggle();
                $ele.play();
                $pause.toggle();
            });
            $pause.click(function () {
                $pause.toggle();
                $ele.pause();
                $play.toggle();
            });
            $progress.click(function (e) {
                $ele.currentTime = (e.offsetX / $progress.width()) * $ele.duration;
            });
            /*播放完进度条为0*/
            $ele.onended = function () {
                $pause.toggle();
                $play.toggle();
                $('.audio .progress span').css("width", 0);
            };
            /*音量控制*/
            var bili = 0.5;
            var value = Math.floor(bili * 100);
            $audio.volume = bili;
            var $audioVolume = $('.audioVolume');
            $('.audioVolume span').css('width', value + '%');
            $('.audio .volume').on('click.audio', function () {
                $audioVolume.toggleClass('none');
                $('.audio .volume').css("margin-right", "15px");
                //  声音调节大小
                $audioVolume[0].addEventListener('click', function (e) {
                    bili = e.offsetX / $audioVolume.width();
                    if (bili >= 1) {
                        bili = 1
                    }
                    if (bili <= 0) {
                        bili = 0
                    }
                    value = Math.floor(bili * 100);
                    $('.audioVolume span').css('width', value + '%');
                    $audio.volume = bili;
                });
            })
        } else {
            var $cplay = $('.controls .play'),
                $cpause = $('.controls .pause'),
                $cprogress = $('.controls .progress');
            /*设置播放和暂停*/
            $cplay.click(function () {
                $cplay.toggle();
                $ele.play();
                $cpause.toggle();
            });
            $cpause.click(function () {
                $cpause.toggle();
                $ele.pause();
                $cplay.toggle();
            });
            $cprogress.click(function (e) {
                $ele.currentTime = (e.offsetX / $cprogress.width()) * $ele.duration;
            });
            /*播放完进度条为0*/
            $ele.onended = function () {
                $cpause.toggle();
                $cplay.toggle();
                $('.controls .progress span').css("width", 0);
            };
            /*音量控制*/
            var videobili = 0.5;
            var videoValue = Math.floor(videobili * 100);
            $video.volume = videobili;
            var $videoVolume = $('.videoVolume');
            $('.videoVolume span').css('width', videoValue + '%');
            $('.video .volume').on('click.audio', function () {
                $videoVolume.toggleClass('none');
                //  声音调节大小
                $videoVolume[0].addEventListener('click', function (e) {
                    videobili = e.offsetX / $videoVolume.width();
                    if (videobili >= 1) {
                        videobili = 1
                    }
                    if (videobili <= 0) {
                        videobili = 0
                    }
                    videoValue = Math.floor(videobili * 100);
                    $('.videoVolume span').css('width', videoValue + '%');
                    $video.volume = videobili;
                });
            });
            /*全屏显示*/
            $('.controls .full').on('click', function () {
                $ele.webkitRequestFullScreen();
            });
        }


    }

    media($audio);
    media($video);
    // 轮播图
    (function () {
        var time = null,
            $imglist = $('.imgList'),
            $image = $('.image'),
            $listImg = $('.imgList img'),
            $next = $('#next'),
            $prev = $('#prev'),
            $indexList = $('.indexList');
        $imglist.width($image.width() * $listImg.length + 'px');
        $listImg.width($image.width() + 'px');
        var aBtn = '';
        for (var i = 1; i <= $listImg.length; i++) {
            aBtn += '<li></li>'
        }
        $indexList.html(aBtn);
        var index = 0;
        $next.on('click', function () {
            next();
        });
        $prev.on('click', function () {
            prev();
        });
        $('.indexList li').on('click', function () {
            var index = $(this).index();
            mover(index);
        });
        time = setInterval(function () {
            next()
        }, 3000);

        function clear(sele) {
            sele.hover(function () {
                clearInterval(time);
            }, function () {
                time = setInterval(function () {
                    next()
                }, 3000);
            });
        }

        clear($next);
        clear($prev);
        clear($indexList);

        function next() {
            index++;
            if (index > $('.imgList img').length - 1) {
                index = 0;
            }
            mover(index);
        }

        function prev() {
            index--;
            if (index < 0) {
                index = $('.imgList img').length - 1;
            }
            mover(index);
        }

        function mover(index) {
            $('.imgList').css({
                left: -$('.image').width() * index + 'px',
                transition: '.5s'
            });
            $('.indexList li').removeClass('active').eq(index).addClass('active')
        }
    })();

});