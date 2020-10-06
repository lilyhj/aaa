// $(function () {
//   var form = layui.form;
//   var layer = layui.layer;
//   form.verify({
//     pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
//     samePwd: function (value) {
//       var pwd = $("[name=password]").val();
//       if (pwd === value) {
//         return "新旧密码不能相同！";
//       }
//     },
//     //校验两次输入的密码是否一致
//     repwd: function (value) {
//       var pwd = $("[name=newpwd]").val();
//       if (pwd !== value) {
//         return "两次密码不一致！";
//       }
//     },
//   });
//   //监听表单提交事件
//   $(".layui-form").on("submit", function (e) {
//     e.preventDefault();
//     $.ajax({
//       method: "POST",
//       url: "/my/updatepwd",
//       data: $(this).serialize(),
//       success: function (res) {
//         if (res.status !== 0) {
//           return layer.msg("更新密码失败");
//         }
//         layer.msg("更新密码成功");
//         //重置表单
//         $(".layui-form")[0].reset();
//       },
//     });
//   });
// });
$(function () {
  var form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能相同！";
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次密码不一致！";
      }
    },
  });

  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新密码失败！");
        }
        layui.layer.msg("更新密码成功！");
        // 重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
});
