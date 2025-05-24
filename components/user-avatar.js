import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"


const UserAvatar = ({user}) => {
  return (
    <div className="flex items-center space-x-2 w-full">
    <Avatar className={'h-6 w-6'}>
  <AvatarImage src={user?.imageUrl} alt={user?.name}/>
  <AvatarFallback className={'capitalize'}>{user?user.name: '?'}</AvatarFallback>
</Avatar>
<span className="text-xs dark:text-gray-400 font-bold text-gray-800">
  {user? user.name: "Unassigned"}
</span>
</div>
  )
}

export default UserAvatar