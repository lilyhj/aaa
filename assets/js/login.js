$(function () {
  //点击注册账号
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });
  //从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  //   通过form.verify()函数自定义校验规则
  form.verify({
    psw: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //校验两次输入的密码是否一致
    repwd: function (value) {
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });
});
$("#form_reg").on("submit", function (e) {
  //阻止默认行为
  e.preventDefault();
  //发起ajax的post请求
  var data = {
    username: $("#form_reg [name=username]").val(),
    password: $("#form_reg [name=password]").val(),
  };
  $.post("/api/reguser", data, function (res) {
    // console.log(res.message);
    if (res.status !== 0) {
      // return console.log(res);
      return layer.msg(res.message);
    }
    layer.msg("注册成功！");
    $("#link_login").click();
  });
});
$("#form_login").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "/api/login",
    method: "post",
    data: $(this).serialize(),
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("登陆失败！");
      }
      layer.msg("登陆成功！");
      // 将登录成功得到的 token 字符串，保存到 localStorage 中
      //
      localStorage.setItem("token", res.token);
      location.href = "/index.html";
    },
  });
});
