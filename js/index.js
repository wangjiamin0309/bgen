// 登录部分弹出框功能
$(function () {
    $(".nano").nanoScroller();
    var $login = $('.login'),
        $enter = $('#enter'),
        $reg = $('#reg'),
        $register = $('#register'),
        $findPass = $('#findPass'),
        $find = $('#find'),
        $black = $('#black'),
        $blackEnter = $('#blackEnter'),
        $protocol = $('#protocol'),
        $proBut = $('#protocol button'),
        $_search = $('.search'),
        $search = $('#search'),
        $mask = $('#mask');

    //弹出框切换方法
    function toggClass($ele, $ele1, $ele2) {
        $ele.on('click', function () {
            $ele1.toggleClass('active');
            $ele2.toggleClass('active');
            btnReset();
        });
    }

    // 重置验证码按钮
    function btnReset() {
        clearInterval(getCodeTime);
        $('.getCode').text('获取验证码').prop('disabled', false);
    }

    toggClass($reg, $enter, $register);
    toggClass($findPass, $enter, $find);
    toggClass($black, $register, $enter);
    toggClass($blackEnter, $find, $enter);

    //导航搜索按钮
    $_search.on('click', function () {
        $enter.removeClass('active');
        $protocol.removeClass('active');
        $find.removeClass('active');
        $register.removeClass('active');
        $(this).toggleClass('active').siblings().removeClass('active');
        if ($(this).hasClass('active')) {
            $mask.removeClass('none');
            $('.list2, .list3, .list4').removeClass('none');
        } else {
            $mask.addClass('none');
            $('.list2, .list3, .list4').addClass('none');
        }
        $search.toggleClass('active');
        btnReset();
    });

    //导航登录按钮
    $login.on('click', function () {
        $('.list2, .list3, .list4').addClass('none');
        $search.removeClass('active');
        $login.toggleClass('active').siblings().removeClass('active');
        $enter.siblings().removeClass('active');
        if ($(this).hasClass('active')) {
            $enter.toggleClass('active');
            $mask.removeClass('none');
        } else {
            $enter.removeClass('active');
            $mask.addClass('none');
        }
    });

    // 点击遮罩层
    $mask.on('click', function () {
        $login.removeClass('active');
        $_search.removeClass('active');
        $search.removeClass('active');
        $(this).addClass('none');
        $('.list2, .list3, .list4').animate({
            'width': '0'
        }, 0);
        $('#enter, #protocol, #find, #register').removeClass('active');
    });

    //验证表单的同意协议按钮
    $('#enter, #register').on('submit', 'form', function () {
        if (!$(this).find('input[type="checkbox"]')[0].checked) {
            alert("请阅读协议,并勾选按钮!");
            return false;
        }
    });

    //进入协议弹出框
    $('small').on('click', function () {
        $protocol.toggleClass('active').css({
            'z-index': 2
        });
        $('.close').on('click', function () {
            $protocol.removeClass('active');
            if (!$('.disabled').prop('disabled')) {
                $('.check input').prop('checked', true);
            } else {
                $('.check input').prop('checked', false);
            }
        });
        $proBut.on('click', function () {
            $protocol.removeClass('active');
            return false
        })
    });
    //发送验证码
    var getCodeTime = null;
    $('.getCode').on('click', function () {
        var $this = $(this);
        var time = 59;
        $this.prop('disabled', true);
        if ($this.prop('disabled')) {
            getCodeTime = setInterval(function () {
                $this.text(time--);
                if (time < 0) {
                    btnReset();
                }
            }, 1000);
        }
    });
    //协议确认
    $protocol.on('click', function () {
        if ($('#protocol input[type="checkbox"]')[0].checked) {
            $proBut.removeClass('disabled').removeAttr('disabled')
        } else {
            $proBut.addClass('disabled').attr('disabled', 'disabled')
        }
    });

});
// 检索部分、多级菜单
$(function () {
    /*

    列表数据应在以下方法里面掉接口,获取数据进行渲染,以下仅为参考案例
    加载页面,渲染一级列表数据，分类检索和专业检索功能一样，
    如果专业检索和分类检索是一个接口，也可以合起来实现
    这里只单独做了专业检索功能，分类检索功能自行实现

    */

    /*
   
    调接口拿专业检索数据，存专业检索数据，渲染专业检索数据

    */
    $.ajax({
        url: 'data/retrieval.json',
        type: 'GET',
        dataType: 'json',
        success: function (e) {
            $.listData = e;
            var list = '';
            $.each(e, function (index) {
                list += '<li>' + index + '</li>';
            });
            $('.expert .list').html(list);
        }
    });
    // 根据屏幕宽度判断二级列表宽度,该部分可以通过css实现，以及列表开关动画，都可以通过css进行实现
    var winWidth = $('html,body').width();
    var listWidth = 0;
    if (winWidth > 1280) {
        listWidth = 228;
    } else if (winWidth > 992) {
        listWidth = 176;
    } else if (winWidth > 768) {
        listWidth = 137;
    } else {
        listWidth = '25%';
    }
    // 点击一级检索列表
    $('.list').on('click', 'li', function () {
        // 二级列表开关样式以及li是否选中样式切换
        var $that = $(this);
        if ($that.hasClass('active')) {
            $that.removeClass('active');
            $('.list2').animate({
                width: 0
            }, 200);
        } else {
            $that.addClass('active').siblings().removeClass('active');
            $('.list2').animate({
                width: listWidth
            }, 200);
        }
        $('.list3, .list4').animate({
            width: 0
        }, 200);

        // 取消input中绑定给列表绑定的点击事件
        $('.list2,.list3,.list4').off('click.val');

        // 根据点击的li去渲染二级列表数据
        var list2 = '';
        $.each($.listData, function (index, item) {
            if ($that.text() === index) {
                $.each(item, function (index) {
                    list2 += '<li>' + index + '</li>';
                });
            }
        });
        // 给二级列表绑定点击事件,根据点击的二级列表去渲染三级列表
        $('.list2 ul').html(list2).on('click.list', 'li', function () {
            var $that = $(this);
            var list3 = '';
            $.each($.listData, function (index, item) {
                $.each(item, function (index, item) {
                    if ($that.text() === index) {
                        $.each(item, function (index) {
                            list3 += '<li>' + index + '</li>';
                        });
                    }
                });
            });
            $('.list3 ul').html(list3);
        });
        // 给三级列表绑定点击事件,根据点击的三级列表去渲染四级列表
        $('.list3').on('click.list', 'li', function () {
            var $that = $(this);
            var list4 = '';
            $.each($.listData, function (index, item) {
                $.each(item, function (index, item) {
                    $.each(item, function (index, item) {
                        if ($that.text() === index) {
                            $.each(item, function (index, item) {
                                list4 += '<li>' + item + '</li>';
                            });
                        }
                    });

                });
            });
            $('.list4 ul').html(list4);
        });


    });


    // 点击二级检索列表
    $('.list2').on('click', 'li', function () {
        // 三级列表开关样式以及li是否选中样式切换
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.list3').animate({
                width: 0
            }, 200);
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            $('.list3').animate({
                width: listWidth
            }, 200);
        }
        $('.list4').animate({
            width: 0
        }, 200);
    });
    var $list3 = $('.list3');
    // 点击三级检索列表
    $list3.on('click', 'li', function () {
        // 四级列表开关样式以及li是否选中样式切换
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.list4').animate({
                width: 0
            }, 200);
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            $('.list4').animate({
                width: listWidth
            }, 200);
        }
    });
    // 点击四级检索列表
    $('.list4').on('click', 'li', function () {
        // 进行检索,传递参数
        $(this).addClass('active').siblings().removeClass('active');
        var key2 = encodeURI($('.list2 li.active').text());
        var key3 = encodeURI($('.list3 li.active').text());
        var key4 = encodeURI($('.list4 li.active').text());
        location.href = 'retrieval1.html?key2=' + key2 + '&key3=' + key3 + '&key4=' + key4;
    });

    // 省级获取焦点
    /*

     列表数据直接加在了jquery对象上，地域检索的数据做了本地存储，
     一共用了两种方法，自行参考选择更合适的一种

     */
    $('#province').on('focus', function () {

        $('.list3,.list4').animate({
            width: 0
        }, 200);
        /*

        先取消列表上绑定的点击事件,然后再绑定新的点击事件，
        该部分也可以直接写在列表点击事件中，
        然后判断是哪个元素触发的，再去判断是否执行设置input的value值
        数据渲染方法和列表渲染大同小异，也可进行二次封装

        */
        $('.list2').animate({
            width: listWidth
        }, 200).off('click.list').on('click.val', 'li', function () {
            $('#province').val($(this).text());
            $('#city')[0].focus();
            $('#city,#counties').val('');
        });
        if (!$.cityData) {
            $.ajax({
                url: 'data/city.json',
                type: 'GET',
                dataType: 'json',
                success: function (e) {
                    localStorage.setItem('cityData', JSON.stringify(e));
                    provinceListRender();
                }
            })
        } else {
            provinceListRender();
        }
    });


    // 市级获取焦点
    $('#city').on('focus', function () {
        if (!$('#province').val()) {
            return false;
        }
        if ($list3.width() !== listWidth) {
            $('.list3').animate({
                width: listWidth
            }, 200);
        }
        $list3.off('click.list').on('click.val', 'li', function () {
            var $counties = $('#counties');
            $('#city').val($(this).text());
            $counties[0].focus();
            $counties.val('');
        });

        var cHtml = '';
        $.each($.cityData, function (province, city) {
            if (province === $('#province').val()) {
                $.each(city, function (city) {
                    cHtml += '<li>' + city + '</li>';
                })
            }
            $('.list3 ul').html(cHtml);
        });
    });
    // 县级获取焦点
    $('#counties').on('focus', function () {
        if (!$('#province').val() || !$('#city').val()) {
            return false;
        }
        $('.list4').off('click.list').on('click.val', 'li', function () {
            $('#counties').val($(this).text());
        });

        var cHtml = '';
        $.each($.cityData, function (province, city) {
            if (province === $('#province').val()) {
                $.each(city, function (city, counties) {
                    if (city === $('#city').val()) {
                        $.each(counties, function (index, counties) {
                            cHtml += '<li>' + counties + '</li>';
                        })
                    }
                })
            }
            $('.list4 ul').html(cHtml);
        });
    });

    function provinceListRender() {
        $.cityData = JSON.parse(localStorage.getItem('cityData'));
        var pHtml = '';
        $.each($.cityData, function (province) {
            pHtml += '<li>' + province + '</li>';
        });
        $('.list2 ul').html(pHtml);
    }

    // 全文检索
    $('.full-text form').on('submit', function () {
        var key1 = encodeURI($('.full-text [type="search"]').val());
        location.href = 'retrieval1.html?key1=' + key1;
        return false;
    })
});
