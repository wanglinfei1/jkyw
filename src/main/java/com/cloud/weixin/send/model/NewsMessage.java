package com.cloud.weixin.send.model;

import java.util.List;

/**
 * 客服接口发送图文消息 信息类
 * 
 * @author yanyong
 * 
 */
public class NewsMessage extends BaseMessage {

	/*
	 * 图文消息内容
	 */
	private News news;

	public News getNews() {
		return news;
	}

	public void setNews(News news) {
		this.news = news;
	}

	/**
	 * 文本内容类
	 * 
	 * @author yanyong
	 * 
	 */
	public class News {
		/*
		 * 文章列表
		 */
		private List<Article> articles;

		public List<Article> getArticles() {
			return articles;
		}

		public void setArticles(List<Article> articles) {
			this.articles = articles;
		}

		public class Article {

			private String title;// 标题
			private String description;// 描述
			private String url;// 点击后跳转的链接
			private String picurl;// 图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80

			public String getTitle() {
				return title;
			}

			public void setTitle(String title) {
				this.title = title;
			}

			public String getDescription() {
				return description;
			}

			public void setDescription(String description) {
				this.description = description;
			}

			public String getUrl() {
				return url;
			}

			public void setUrl(String url) {
				this.url = url;
			}

			public String getPicurl() {
				return picurl;
			}

			public void setPicurl(String picurl) {
				this.picurl = picurl;
			}
		}
	}
}
