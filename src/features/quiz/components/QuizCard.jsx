import { Link } from 'react-router-dom'
import { Award, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { DateDisplay } from '../../../components/ui/DateDisplay'

export function QuizCard({ quiz, userScore = null }) {
  const hasTakenQuiz = Boolean(userScore)

  return (
    <div className="group flex flex-col justify-between bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2d5356]/40 transition-all duration-200">
      <div>
        {/* Top Header Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#2d5356]/5 border border-[#2d5356]/15 flex items-center justify-center text-[#2d5356] group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5 text-[#2d5356]" />
          </div>

          <div className="flex items-center gap-2">
            {hasTakenQuiz && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12b76a]" />
                Score: {userScore.score}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d09724]/10 text-[#d09724] border border-[#d09724]/20">
              <HelpCircle className="w-3.5 h-3.5" />
              {quiz.question_count ?? 0} {quiz.question_count === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
        </div>

        {/* Topic / Title */}
        <h3 className="font-serif text-xl font-bold text-[#000000] tracking-tight line-clamp-1 mb-2 group-hover:text-[#2d5356] transition-colors">
          {quiz.topic || 'Untitled Quiz'}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#525252] line-clamp-3 leading-relaxed mb-6">
          {quiz.description || 'Test your understanding and challenge yourself with this quiz.'}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between gap-3">
        <DateDisplay date={quiz.created_at} showIcon fallback="Pulse Quiz" />

        <Link to={`/quizzes/${quiz.id}`}>
          <Button
            variant={hasTakenQuiz ? 'secondary' : 'outline'}
            size="sm"
            className="group-hover:bg-[#2d5356] group-hover:text-white group-hover:border-[#2d5356] transition-all flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <span>{hasTakenQuiz ? 'Retake Quiz' : 'Start Quiz'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
