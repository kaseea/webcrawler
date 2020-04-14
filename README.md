# webcrawler

Notes mainly for self, 
npm install.
if downloading from github npm http-server --save to add to dependencies

be mindful each file writes to a text file, some read text files, so be sure they are reading/writing where/what you want.

### Check out dataset on Kaggle

[published dataset on kaggle](https://www.kaggle.com/kaseea/oklahoma-court-fines)

Oklahoma's decided to criminalize poverty to fund the state (instead of taxes):
* [see new yorker article on she still rises](https://www.newyorker.com/magazine/2018/11/05/americas-other-family-separation-crisis)
* [is it a crime to be poor? - nytimes](https://www.nytimes.com/2016/06/12/opinion/sunday/is-it-a-crime-to-be-poor.html)
* [how cities make money by fining the poor - nytimes](https://www.nytimes.com/2019/01/08/magazine/cities-fine-poor-jail.html)
* [oklahoma watch's series 'prisoners of debt'](https://oklahomawatch.org/series/prisoners-of-debt/)


>No government agency comprehensively tracks the extent of criminal-justice debt owed by poor defendants, but experts estimate that those fines and fees total tens of billions of dollars. That number is likely to grow in coming years, and significantly: National Public Radio, in a survey conducted with the Brennan Center for Justice and the National Center for State Courts, found that 48 states increased their civil and criminal court fees from 2010 to 2014. And because wealthy and middle-class Americans can typically afford either the initial fee or the services of an attorney, it will be the poor who shoulder the bulk of the burden.

This webcrawler builds a dataset that finds:
* cases against an individual by county
* each fine assessed to a case 
* collection of total fines by category

so someone can analyze:
* different types of fines assessed
* which counties charge the most fines 


