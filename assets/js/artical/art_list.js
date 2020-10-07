$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  // 补零
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  var qingqiu = {
    pagenum: 1, // 页码
    pagesize: 2, // 每页几条数据
    cate_id: "",
    state: "", // 状态
  };
  initTable();
  initCate();
  // 获取列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: qingqiu,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 模板引擎渲染
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 调用渲染分页方法
        renderPage(res.total);
      },
    });
  }

  // 文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 为筛选绑定 submit 事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取选中项值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 查询参数对象的值
    qingqiu.cate_id = cate_id;
    qingqiu.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用layui里面的方法 laypage.render()方法来渲染分页
    laypage.render({
      elem: "pageBox", 
      count: total,
      limit: qingqiu.pagesize,
      curr: qingqiu.pagenum, 
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        console.log(first);
        console.log(obj.curr);
        qingqiu.pagenum = obj.curr;
        //新的条目数
        qingqiu.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 代理删除绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    // 获取删除按钮的个数
    var len = $(".btn-delete").length;
    console.log(len);
    // 获取到文章的 id
    var id = $(this).attr("data-id");
    // 询问用户是否要删除数据
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            qingqiu.pagenum = qingqiu.pagenum === 1 ? 1 : qingqiu.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
