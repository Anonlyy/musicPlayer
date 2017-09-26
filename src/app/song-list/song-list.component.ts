import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MusicService, EmitSong} from "../service/music.service";
import {Song} from "../content-index/content-index.component";

@Component({
  selector: 'song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  id:string;
  playListDetail:PlayListDetail = new PlayListDetail('null','/assets/image/loading.jpg','暂无描述',[],0,'admin','/assets/image/loading.jpg'); //歌单详情对象
  song:Song = new Song('0','null','null','0','http://iph.href.lu/56x65');
  songList=[];//存储所有歌曲对象
  default ='/assets/image/loading.jpg';
  constructor(public routerInfo:ActivatedRoute,public musicService:MusicService) { }
  ngOnInit() {
    const _this = this;
    this.routerInfo.params.subscribe(
      data=>{
        //noinspection TypeScriptUnresolvedVariable
        _this.id = data.id;
        _this.getplayList(_this.id);
      }
    )
  }
  public getplayList(id:string){
    const _this = this;
    _this.musicService.getPlayListDetail(_this.id).subscribe(
      result=>{
        let data = result.playlist;
        if(result.code==200){
          _this.playListDetail = new PlayListDetail(
            data.name,
            data.coverImgUrl,
            data.description?data.description:'###这位同志很懒,暂无歌单描述###',
            data.tags,
            data.trackCount,
            data.creator.nickname,
            data.creator.avatarUrl
          );
          for(let item of result.playlist.tracks){
            _this.song = new Song(item.id,item.name,item.ar[0].name,item.ar[0].id,item.al.picUrl,item.al.name,item.dt);
            _this.songList.push(_this.song);
          }
        }
        console.log(result);
      },
      error=>{
        console.log('error',error);
      }
    )
  }
  public updateUrl(e){
    e.src = this.default;
  }
  public playAllSong(){
    const _this = this;
    //播放所有歌曲,默认以第一首为当前歌曲
    let songIds = [];
    for(let item of _this.songList){
      songIds.push(item.id);
    }
    //noinspection TypeScriptValidateTypes
    this.musicService.emitSong.emit(new EmitSong(_this.songList[0],songIds));
  }
}


// 歌单详情对象
export class PlayListDetail{
  constructor(
    public name:string,//歌单名字
    public picUrl:string, //歌单图片
    public desc:string,
    public tags:string[], //标签数组
    public trackCount:number, //歌单歌曲数目
    public nickname:string,//歌单作者姓名
    public avatarUrl:string, //歌单作者头像
    public songList?:Song[] //歌单歌曲
  ){}
}
